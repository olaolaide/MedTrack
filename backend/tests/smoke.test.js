/**
 * Smoke test: one happy-path request per MedTrack endpoint.
 *
 * The test runs its OWN copy of your backend, completely separate from the one you develop with:
 *  - it starts `node server.js` as a separate process on a free random port (never your PORT)
 *  - that process connects to a throwaway in-memory MongoDB (never your database or your .env MONGO_URI)
 *  - it talks to it over real HTTP with the built-in fetch, then shuts it down
 * Your own server and database can stay running while the test runs, and they are never touched.
 *
 * Run:      npm test            ("test": "node --test tests/smoke.test.js")
 */
import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {fileURLToPath} from 'node:url';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));

// 1. The test's own database.
let mongod;
let mongoUri = process.env.TEST_MONGO_URI;
if (!mongoUri) {
    const {MongoMemoryServer} = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri('medtrack_smoke');
}

// 2. The test's own server: a separate process on a free port.
const getFreePort = () => new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
        const {port} = probe.address();
        probe.close(() => resolve(port));
    });
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PORT = await getFreePort();
const BASE = `http://127.0.0.1:${PORT}`;

let child;
let logs = '';

async function startTestServer() {
    child = spawn(process.execPath, ['server.js'], {
        cwd: PROJECT_ROOT,
        env: {
            ...process.env,
            NODE_ENV: 'smoke',
            PORT: String(PORT),
            MONGO_URI: mongoUri,
            CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173'
        },
        stdio: ['ignore', 'pipe', 'pipe']
    });
    child.stdout.on('data', (chunk) => {
        logs += chunk;
    });
    child.stderr.on('data', (chunk) => {
        logs += chunk;
    });

    let exited = false;
    child.once('exit', () => {
        exited = true;
    });

    // server.js connects to the database before it listens, so an answer means it is ready.
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
        if (exited) throw new Error(`Test server exited during startup:\n${logs}`);
        try {
            await fetch(`${BASE}/api/health`);
            return;
        } catch {
            await sleep(250);
        }
    }
    throw new Error(`Test server did not start within 30s:\n${logs}`);
}

async function stopTestServer() {
    if (!child || child.exitCode !== null) return;
    const exited = new Promise((resolve) => child.once('exit', resolve));
    child.kill('SIGTERM');
    const timer = setTimeout(() => child.kill('SIGKILL'), 5_000);
    await exited;
    clearTimeout(timer);
}

async function api(method, path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: body === undefined ? undefined : JSON.stringify(body)
    });
    let json = null;
    try {
        json = await res.json();
    } catch { /* not JSON */
    }
    return {status: res.status, body: json};
}

const get = (path, query = {}) => api('GET', `${path}${Object.keys(query).length ? `?${new URLSearchParams(query)}` : ''}`);
const post = (path, body) => api('POST', path, body);

const PATIENT = {
    PatientID: 'P-SMOKE-001',
    PatientName: 'Smoke Test',
    Age: 40,
    Gender: 'Female',
    City: 'SmokeTestCity',
    Department: 'SmokeTestDept',
    AdmissionDate: '2024-06-01',
    Diagnosis: 'Checkup',
    DoctorAssigned: 'Dr. Smith',
    Status: 'Admitted',
    LengthOfStay: 2,
    TreatmentCost: 1500
};

// Only matters when TEST_MONGO_URI points at a shared database. It only touches SmokeTestCity.
const cleanUp = () => post('/api/patients/delete', {City: PATIENT.City, Status: PATIENT.Status});

before(async () => {
    await startTestServer();
    await cleanUp();
    console.log(`[smoke] test server running on ${BASE} (separate from your backend)`);
});

after(async () => {
    await cleanUp().catch(() => {
    });
    await stopTestServer();
    await mongod?.stop();
});

test('GET /api/health responds 200', async () => {
    const res = await get('/api/health');

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
});

test('1.5 POST /api/patients responds 201', async () => {
    const res = await post('/api/patients', PATIENT);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
});

test('GET /api/patients/:patientID responds 200 (Update screen "Load")', async () => {
    const res = await get(`/api/patients/${PATIENT.PatientID}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.PatientID, PATIENT.PatientID);
});

test('1.6 POST /api/patients/update responds 200', async () => {
    const res = await post('/api/patients/update', {PatientID: PATIENT.PatientID, TreatmentCost: 1750});

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
});

test('1.8 GET /api/stats/:department responds 200 with cost and average stay', async () => {
    const res = await get(`/api/stats/${encodeURIComponent(PATIENT.Department)}`);
    // The data is an object, or a one-item array in the original controller.
    const stats = Array.isArray(res.body.data) ? res.body.data[0] : res.body.data;

    assert.equal(res.status, 200);
    assert.ok('TotalTreatmentCost' in stats);
    assert.ok('AverageLengthOfStay' in stats);
});

test('1.9 GET /api/patients/long-stay responds 200 with a data array', async () => {
    const res = await get('/api/patients/long-stay', {department: PATIENT.Department, minStay: 1});

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
});

test('1.10 GET /api/patients/high-avg-cost responds 200 with the average and a data array', async () => {
    const res = await get('/api/patients/high-avg-cost', {department: PATIENT.Department, minAverageCost: 1});

    assert.equal(res.status, 200);
    assert.ok('averageTreatmentCost' in res.body);
    assert.ok(Array.isArray(res.body.data));
});

test('1.11 GET /api/summary responds 200 with departments and totals', async () => {
    const res = await get('/api/summary');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.departments));
    assert.ok('totals' in res.body.data);
});

// Remove this test if you did not build the Delete preview endpoint.
test('GET /api/patients/preview responds 200 with a total', async () => {
    const res = await get('/api/patients/preview', {city: PATIENT.City, status: PATIENT.Status});

    assert.equal(res.status, 200);
    assert.equal(typeof res.body.total, 'number');
});

test('1.7 POST /api/patients/delete responds 200 with deletedCount', async () => {
    const res = await post('/api/patients/delete', {City: PATIENT.City, Status: PATIENT.Status});

    assert.equal(res.status, 200);
    assert.equal(typeof res.body.deletedCount, 'number');
});
