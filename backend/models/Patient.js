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
        required: true,
        enum: ['Male', 'Female', 'Other']
    },

    City: {
        type: String,
        required: true,
        trim: true
    },

    Department: {
        type: String,
        required: true,
        trim: true
    },

    AdmissionDate: {
        type: Date,
        required: true
    },

    Diagnosis: {
        type: String,
        required: true,
        trim: true
    },

    DoctorAssigned: {
        type: String,
        required: true,
        trim: true
    },

    Status: {
        type: String,
        required: true,
        enum: ['Admitted', 'Discharged', 'Under Treatment']
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

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
