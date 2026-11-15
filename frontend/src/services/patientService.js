import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2.1 Add Patient
export const addPatient = (patientData) => {
    return api.post('/patients', patientData);
};

// 2.2 Update Patient
export const updatePatient = (patientData) => {
    return api.post('/patients/update', patientData);
};

// Supporting endpoint for loading patient data by ID
export const getPatientById = (patientID) => {
    return api.get(`/patients/${patientID}`);
};

// 2.3 Department Statistics
export const getDepartmentStats = (department) => {
    return api.get(`/stats/${department}`);
};

// Supporting endpoint for delete preview
export const previewDelete = (city, status) => {
    return api.get('/patients/preview', {
        params: {
            city,
            status
        }
    });
};

// 2.4 Delete Patients by City and Status
export const deletePatients = (city, status) => {
    return api.post('/patients/delete', {
        city,
        status
    });
};

// 2.5 First 10 Patients with LengthOfStay > value
export const getLongStayPatients = (department, lengthOfStay) => {
    return api.get('/patients/long-stay', {
        params: {
            department,
            lengthOfStay
        }
    });
};

// 2.6 Average Treatment Cost Condition
export const getPatientsByAverageCost = (department, condition, cost) => {
    return api.get('/patients/high-avg-cost', {
        params: {
            department,
            condition,
            cost
        }
    });
};

// 2.7 Department Summary
export const getDepartmentSummary = () => {
    return api.get('/summary');
};

export default api;
