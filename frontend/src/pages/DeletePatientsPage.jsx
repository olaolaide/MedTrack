// importing all the parts :D
import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState.jsx";
import api from "../services/patientService";
import { previewDelete } from "../services/patientService";
import { formatCurrencyGBP } from "../utils/helper.js";
import { IoIosTrash } from "react-icons/io";


export default function DeletePatientsPage() {
    const [city, setCity] = useState("");
    const [status, setStatus] = useState("Admitted");
    const [patients, setPatients] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Run function every time the city or the status changes
    useEffect(() => {
        getPreview();
    }, [city, status]);


    // using async/await to fetch the matching patients
    const getPreview = async () => {
        // no city typed so there is nothing to look for
        if (city.trim() === "") {
            setPatients([]);
            setTotal(0);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await previewDelete(city.trim(), status);

            setPatients(response.data.sample);
            setTotal(response.data.total);

        } catch (err) {
            setError("Unable to load matching records");
        } finally {
            setLoading(false);
        }
    };

    // when the city box changes
    const handleCityChange = (e) => {
        setCity(e.target.value);
        setSuccess(null);
    };

    // when the status dropdown changes
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setSuccess(null);
    };

    // deletes the records using the task 1.7 endpoint
    const handleDelete = async () => {
        if (city.trim() === "") {
            setError("Please enter a city");
            return;
        }

        if (total === 0) {
            setError("There are no matching records to delete");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete " + total + " patient records from " + city.trim() + " with status " + status + "? This cannot be undone."
        );

        if (confirmDelete === false) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);
            setSuccess(null);

            // the backend wants City and Status with capital letters
            const response = await api.post("/patients/delete", {
                City: city.trim(),
                Status: status
            });

            setSuccess(response.data.message);
            setPatients([]);
            setTotal(0);

        } catch (err) {
            setError("Unable to delete patient records");
        } finally {
            setDeleting(false);
        }
    };

    // some patients have no admission date so show a dash instead
    const getAdmissionDate = (date) => {
        if (!date) {
            return "-";
        }

        return date.slice(0, 10);
    };

    // picks the colour class for the status column
    const getStatusClass = (patientStatus) => {
        if (patientStatus === "Admitted") {
            return "status-admitted";
        }

        if (patientStatus === "Under Treatment") {
            return "status-treatment";
        }

        return "status-discharged";
    };

    return(

        <div className = "page-stack">
            <div className = "page-header">
                <div>
                    <h1> Delete records by city & status </h1>
                    <p> Remove patient records matching a specific city and admission status. Matching records are previewed below before deletion. </p>
                </div>
            </div>

            <div className = "panel">
                <div className = "formRow">
                    <div className = "deleteCityCon">
                        <p className = "formLabel"> City </p>
                        <input
                            name = "City"
                            className = "formInput"
                            type = "text"
                            placeholder = "e.g. London"
                            value = {city}
                            onChange = {handleCityChange}
                        />
                    </div>

                    <div className = "deleteStatusCon">
                        <p className = "formLabel"> Status </p>
                        <select name = "Status" className = "formInput" value = {status} onChange = {handleStatusChange}>
                            <option value = "Admitted"> Admitted </option>
                            <option value = "Under Treatment"> Under Treatment </option>
                            <option value = "Discharged"> Discharged </option>
                        </select>
                    </div>

                    <button
                        className = "button button-danger button-full"
                        type = "button"
                        onClick = {handleDelete}
                        disabled = {deleting || loading || total === 0}
                    >
                        <IoIosTrash /> Delete {total} Matching Records
                    </button>
                </div>

                {error && <p className = "errorText"> {error} </p>}
                {success && <p className = "successText"> {success} </p>}
            </div>

            {loading && <LoadingState message = "Loading patients..." />}

            {/* nothing typed yet */}
            {!loading && city.trim() === "" && (
                <div className = "empty-panel">
                    <h2> Enter a city to preview records </h2>
                    <p> Matching patient records will show here before you delete them. </p>
                </div>
            )}

            {/* typed a city but nothing matched */}
            {!loading && city.trim() !== "" && total === 0 && (
                <div className = "empty-panel">
                    <h2> No matching records </h2>
                    <p> There are no {status} patients in {city.trim()}. </p>
                </div>
            )}

            {/* the preview table */}
            {!loading && total > 0 && (
                <div className = "previewCon">
                    <div className = "previewHeader">
                        <h2 className = "previewTitle"> Matching records preview ({total}) </h2>
                        <span className = "previewFilter"> {city.trim()} · {status} </span>
                    </div>

                    <div className = "table-panel">
                        <div className = "table-scroll">
                            <table className = "data-table">
                                <thead>
                                    <tr>
                                        <th> Patient ID </th>
                                        <th> Patient Name </th>
                                        <th className = "numeric"> Age </th>
                                        <th> Gender </th>
                                        <th> City </th>
                                        <th> Department </th>
                                        <th> Admission Date </th>
                                        <th> Diagnosis </th>
                                        <th> Doctor Assigned </th>
                                        <th> Status </th>
                                        <th className = "numeric"> Stay (Days) </th>
                                        <th className = "numeric"> Treatment Cost </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key = {patient.PatientID}>
                                            <td className = "monoCell"> {patient.PatientID} </td>
                                            <td className = "boldCell"> {patient.PatientName} </td>
                                            <td className = "numeric"> {patient.Age} </td>
                                            <td> {patient.Gender} </td>
                                            <td> {patient.City} </td>
                                            <td className = "boldCell"> {patient.Department} </td>
                                            <td className = "monoCell"> {getAdmissionDate(patient.AdmissionDate)} </td>
                                            <td> {patient.Diagnosis} </td>
                                            <td> {patient.DoctorAssigned} </td>
                                            <td className = {getStatusClass(patient.Status)}> {patient.Status} </td>
                                            <td className = "numeric boldCell"> {patient.LengthOfStay} </td>
                                            <td className = "numeric boldCell"> {formatCurrencyGBP(patient.TreatmentCost)} </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className = "table-note"> Showing {patients.length} of {total} matching records. </p>
                    </div>
                </div>
            )}
        </div>
    )
}
