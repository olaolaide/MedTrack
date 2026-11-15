import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    PatientID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    PatientName: {
        type: String,
        required: true,
        trim: true
    },

    Age: {
        type: Number,
        required: true,
        min: 0
    },

    Gender: {
        type: String,
        required: true
    },

    City: {
        type: String,
        required: true
    },

    Department: {
        type: String,
        required: true
    },

    AdmissionDate: {
        type: String,
        required: true
    },

    Diagnosis: {
        type: String,
        required: true
    },

    DoctorAssigned: {
        type: String,
        required: true
    },

    Status: {
        type: String,
        required: true
    },

    LengthOfStay: {
        type: Number,
        required: true,
        min: 0
    },

    TreatmentCost: {
        type: Number,
        required: true,
        min: 0
    }

}, {
    collection: 'PatientData',
    versionKey: false
});

const Patient = mongoose.model('Patient', patientSchema, 'PatientData');

export default Patient;
