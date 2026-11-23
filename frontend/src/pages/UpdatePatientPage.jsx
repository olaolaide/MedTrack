import { useEffect, useState } from "react";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { getAllPatients, getPatientById, updatePatient } from "../services/patientService";
import { IoIosSearch } from "react-icons/io";

export default function UpdatePatientPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [patientID, setPatientID] = useState("");
    const [success, setSuccess] = useState(null);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const response = await getAllPatients();
                console.log("response:", response);
                setPatients(response?.data?.data ?? []);
            } catch (err) {
                console.error("fetch failed:", err);
                setError(err.response?.data?.message || "Failed to load patients");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handlePatientSelect = (e) => {
        setPatientID(e.target.value);
        setError(null);
    };

    return (
        <div className="topHalf">
            <h1>Update patient record</h1>
            <p>
                Look up a patient by Patient ID and update any of their 11 clinical and billing fields
            </p>

            {loading && <LoadingState />}
            {error && <ErrorState message={error} />}

            <div className="selectPatientCon">
                <div className="byName">
                    <p className="patientName">Select an existing patient</p>

                    <select
                        name="PatientName"
                        className="patientNameSelect"
                        value={patientID}
                        onChange={handlePatientSelect}
                    >
                        <option value="">Select a patient</option>

                        {patients.map((patient) => (
                            <option key={patient.PatientID} value={patient.PatientID}>
                                {patient.PatientID} | {patient.PatientName} | {patient.Department}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="byID">
                    <p className="IDTitle">Or enter a Patient ID</p>

                    <input
                        name="PatientID"
                        className="selectPatientID"
                        value={patientID}
                        onChange={(e) => setPatientID(e.target.value)}
                    />
                </div>

                <div className="btnSearchID">
                    <button className="btnSearch" type="button">
                        <IoIosSearch className="srcIcon" /> Load record
                    </button>
                </div>
            </div>

            <div className="updatePatientCon"></div>
        </div>
    );
}