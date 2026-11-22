import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2.1 Add Patient
export const addPatient = (patientData) =>
    api.post('/patients', patientData);

// 2.2 Update Patient
export const updatePatient = (patientData) =>
    api.post('/patients/update', patientData);

// Supporting endpoint: Get patient by ID
export const getPatientById = (patientID) =>
    api.get(`/patients/${encodeURIComponent(patientID)}`);

// 2.3 Department Statistics
export const getDepartmentStats = (department) =>
    api.get(`/stats/${encodeURIComponent(department)}`);

// Supporting endpoint: Delete preview
export const previewDelete = (city, status) =>
    api.get('/patients/preview', {
        params: {city, status}
    });

// 2.4 Delete Patients by City and Status
export const deletePatients = (city, status) =>
    api.post('/patients/delete', {city, status});

// 2.5 First 10 Patients with LengthOfStay > value
export const getLongStayPatients = (department, minStay) =>
    api.get('/patients/long-stay', {
        params: {
            department,
            minStay
        }
    });

// 2.6 Average Treatment Cost Condition
export const getPatientsByAverageCost = (department, minAverageCost) =>
    api.get('/patients/high-avg-cost', {
        params: {
            department,
            minAverageCost
        }
    });

// 2.7 Department Summary
export const getDepartmentSummary = async () => {
    const {data} = await api.get('/summary');
    return data.data;
};

export default api;
