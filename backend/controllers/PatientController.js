import Patient from "../models/Patient.js";

export const addPatient = async (req, res) => {
    try {
        // Get patient information from request body
        const {
            PatientID,
            PatientName,
            Age,
            Gender,
            City,
            Department,
            AdmissionDate,
            Diagnosis,
            DoctorAssigned,
            Status,
            LengthOfStay,
            TreatmentCost
        } = req.body;

        // Check if PatientID already exists
        const existingPatient = await Patient.findOne({
            PatientID: PatientID
        });

        if (existingPatient) {
            return res.status(409).json({
                success: false,
                message: 'Patient ID already exists'
            });
        }

        // Create a new patient document
        const newPatient = new Patient({
            PatientID,
            PatientName,
            Age,
            Gender,
            City,
            Department,
            AdmissionDate,
            Diagnosis,
            DoctorAssigned,
            Status,
            LengthOfStay,
            TreatmentCost
        });

        // Save patient to MongoDB
        const savedPatient = await newPatient.save();

        // Return successful response
        res.status(201).json({
            success: true,
            message: 'Patient added successfully',
            data: savedPatient
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
}
export const updatePatient = async (req, res) => {
    try {
        // Get PatientID and updated information
        const {PatientID, ...updateData} = req.body;

        // Check whether PatientID was provided
        if (!PatientID) {
            return res.status(400).json({
                success: false,
                message: 'PatientID is required'
            });
        }

        // Fields that are allowed to be updated
        const allowedFields = [
            'PatientName',
            'Age',
            'Gender',
            'City',
            'Department',
            'AdmissionDate',
            'Diagnosis',
            'DoctorAssigned',
            'Status',
            'LengthOfStay',
            'TreatmentCost'
        ];

        // Include only fields provided in the request
        const updates = {};

        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                updates[field] = updateData[field];
            }
        });

        // Check whether any fields were provided for updating
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No changes were provided'
            });
        }

        // Update the patient record
        const updatedPatient = await Patient.findOneAndUpdate(
            {PatientID: PatientID},
            {$set: updates},
            {
                new: true,
                runValidators: true
            }
        );

        // Check whether patient exists
        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Return successful response
        res.status(200).json({
            success: true,
            message: 'Patient updated successfully',
            data: updatedPatient
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const getPatientById = async (req, res) => {
    try {
        // Get PatientID from URL parameters
        const {patientID} = req.params;

        // Find patient using PatientID
        const patient = await Patient.findOne({
            PatientID: patientID
        });

        // Check whether patient exists
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Return patient information
        res.status(200).json({
            success: true,
            message: 'Patient loaded successfully',
            data: patient
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deletePatient = async (req, res) => {
    try {
        const {City, Status} = req.body;

        // Validate required fields
        if (!City || !Status) {
            return res.status(400).json({
                success: false,
                message: 'City and Status are required'
            });
        }

        // Delete matching patient records
        const result = await Patient.deleteMany({
            City: City,
            Status: Status
        });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} patient(s) deleted successfully`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getDepartmentStats = async (req, res) => {
    try {
        const {department} = req.params;

        const result = await Patient.aggregate([
            {
                $match: {
                    Department: department
                }
            },
            {
                $group: {
                    _id: '$Department',
                    TotalTreatmentCost: {
                        $sum: '$TreatmentCost'
                    },
                    AverageLengthOfStay: {
                        $avg: '$LengthOfStay'
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getLongStayPatients = async (req, res) => {
    try {
        const {department, minStay} = req.query;

        if (!department || minStay === undefined ||
            minStay === '' || !Number.isFinite(Number(minStay))) {
            return res.status(400).json({
                success: false,
                message: 'Department and valid minimum stay are required'
            });
        }

        const patients = await Patient.find({
            Department: department,
            LengthOfStay: {
                $gt: Number(minStay)
            }
        })
            .sort({LengthOfStay: -1})
            .limit(10);

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getPatientsByAverageCost = async (req, res) => {
    try {
        const {department, minAverageCost} = req.query;

        if (!department || minAverageCost === undefined ||
            minAverageCost === '' ||
            !Number.isFinite(Number(minAverageCost))) {
            return res.status(400).json({
                success: false,
                message: 'Department and valid average cost are required'
            });
        }

        const threshold = Number(minAverageCost);

        // Calculate average treatment cost
        const result = await Patient.aggregate([
            {
                $match: {
                    Department: department
                }
            },
            {
                $group: {
                    _id: '$Department',
                    AverageTreatmentCost: {
                        $avg: '$TreatmentCost'
                    }
                }
            }
        ]);

        // Check whether department has records
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No patients found for this department'
            });
        }

        const averageCost = result[0].AverageTreatmentCost;

        // Compare average cost with user threshold
        if (averageCost <= threshold) {
            return res.status(200).json({
                success: true,
                message: 'Department average treatment cost does not exceed the specified value',
                averageTreatmentCost: averageCost,
                data: []
            });
        }

        // Retrieve all patient records for the department
        const patients = await Patient.find({
            Department: department
        });

        res.status(200).json({
            success: true,
            message: 'Department average treatment cost exceeds the specified value',
            averageTreatmentCost: averageCost,
            count: patients.length,
            data: patients
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getDepartmentSummary = async (req, res) => {
    try {

        // Group patient records by department
        const summary = await Patient.aggregate([
            {
                $group: {
                    _id: '$Department',

                    NumberOfPatients: {
                        $sum: 1
                    },

                    AverageLengthOfStay: {
                        $avg: '$LengthOfStay'
                    },

                    TotalTreatmentCost: {
                        $sum: '$TreatmentCost'
                    }
                }
            },
            {
                $sort: {
                    NumberOfPatients: -1
                }
            }
        ]);

        // Calculate hospital-wide totals
        const totalPatients = summary.reduce(
            (total, dept) => total + dept.NumberOfPatients,
            0
        );

        const totalTreatmentCost = summary.reduce(
            (total, dept) => total + dept.TotalTreatmentCost,
            0
        );

        // Calculate weighted average length of stay
        const totalPatientDays = summary.reduce(
            (total, dept) =>
                total + (
                    dept.AverageLengthOfStay *
                    dept.NumberOfPatients
                ),
            0
        );

        const hospitalAverageStay = totalPatients > 0
            ? totalPatientDays / totalPatients
            : 0;

        // Calculate hospital-wide cost per patient
        const hospitalCostPerPatient = totalPatients > 0
            ? totalTreatmentCost / totalPatients
            : 0;

        // Calculate department percentages and cost per patient
        const departments = summary.map(dept => ({
            Department: dept._id,

            NumberOfPatients: dept.NumberOfPatients,

            PatientShare: totalPatients > 0
                ? (dept.NumberOfPatients / totalPatients) * 100
                : 0,

            AverageLengthOfStay: dept.AverageLengthOfStay,

            TotalTreatmentCost: dept.TotalTreatmentCost,

            CostPerPatient: dept.NumberOfPatients > 0
                ? dept.TotalTreatmentCost / dept.NumberOfPatients
                : 0
        }));

        // Return department summary and hospital-wide totals
        return res.status(200).json({
            success: true,

            data: {
                departments,

                totals: {
                    NumberOfPatients: totalPatients,

                    // FIX: Empty collection should return 0%, not 100%
                    PatientShare: totalPatients > 0 ? 100 : 0,

                    AverageLengthOfStay: hospitalAverageStay,

                    TotalTreatmentCost: totalTreatmentCost,

                    CostPerPatient: hospitalCostPerPatient
                }
            }
        });

    } catch (error) {

        console.error('[getDepartmentSummary] Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve department summary'
        });
    }
};
export const previewDelete = async (req, res) => {
    try {
        const {city, status} = req.query;
        if (!city || !status) {
            return res.status(400).json({success: false, message: 'City and Status are required'});
        }
        const filter = {City: city, Status: status};
        const [total, byDepartment, sample] = await Promise.all([
            Patient.countDocuments(filter),
            Patient.aggregate([{$match: filter}, {
                $group: {
                    _id: '$Department',
                    count: {$sum: 1}
                }
            }, {$sort: {count: -1}}]),
            Patient.find(filter).limit(3)
        ]);
        res.status(200).json({success: true, total, byDepartment, sample});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};