/**
 * One-time importer: UKHospitalData.csv → MongoDB (collection: PatientData).
 * Run with:  npm run data
 *
 * Drops the collection first so re-running gives a clean slate.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'csv-parse/sync';
import {connectDB, disconnectDB} from '../config/database.js';
import Patient from '../models/Patient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.resolve(__dirname, '../data/UKHospitalData.csv');

async function seed() {
    console.log('[data] reading', CSV_PATH);
    const raw = fs.readFileSync(CSV_PATH, 'utf8');

    const rows = parse(raw, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    console.log(`[seed] parsed ${rows.length} rows`);

    // Coerce types so Mongoose validators accept the values
    const docs = rows.map((r) => ({
        PatientID: r.PatientID,
        PatientName: r.PatientName,
        Age: Number(r.Age),
        Gender: r.Gender,
        City: r.City,
        Department: r.Department,
        AdmissionDate: new Date(r.AdmissionDate),
        Diagnosis: r.Diagnosis,
        DoctorAssigned: r.DoctorAssigned,
        Status: r.Status,
        LengthOfStay: Number(r.LengthOfStay),
        TreatmentCost: Number(r.TreatmentCost),
    }));

    await connectDB();
    await Patient.deleteMany({});
    const inserted = await Patient.insertMany(docs, {ordered: false});
    console.log(`[seed] inserted ${inserted.length} patients into PatientData`);
    await disconnectDB();
    process.exit(0);
}

seed().catch((err) => {
    console.error('[data] failed:', err);
    process.exit(1);
});