import {Router} from 'express';
import {
    addPatient,
    updatePatient,
    deletePatient,
    previewDelete,
    getPatientById,
    getDepartmentStats,
    getLongStayPatients,
    getPatientsByAverageCost,
    getDepartmentSummary
} from '../controllers/patientController.js';

const router = Router();

// Writes (brief tasks 1.5, 1.6, 1.7)
router.post('/patients', addPatient);
router.post('/patients/update', updatePatient);
router.post('/patients/delete', deletePatient);

// Reads. Static paths must be registered BEFORE '/patients/:patientID',
// otherwise Express treats "long-stay" as a PatientID.
router.get('/patients/long-stay', getLongStayPatients);           // 1.9
router.get('/patients/high-avg-cost', getPatientsByAverageCost);  // 1.10
router.get('/patients/preview', previewDelete);                   // supporting: Delete screen preview
router.get('/patients/:patientID', getPatientById);               // supporting: Update screen "Load"

router.get('/stats/:department', getDepartmentStats);             // 1.8
router.get('/summary', getDepartmentSummary);                     // 1.11

export default router;