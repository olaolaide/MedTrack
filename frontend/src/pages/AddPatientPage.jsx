// importing all the parts :D
import {useEffect, useState } from "react";
import ErrorState from "../components/ErrorState.jsx";
import { addPatient } from "../services/patientService";
import { IoIosSearch } from "react-icons/io";
import LoadingState from "../components/LoadingState.jsx";
import {getPatientById} from"../services/patientService";
import { data } from "react-router-dom";
import { MdDateRange } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";


export default function AddPatientPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [success, setSuccess] = useState(null);
    const [paitentIds, setPatientIDs] = useState([]);

      // Run function when the page actually runs
    useEffect(() => {
        getPaitentIds();
    }, [])


    // using async/await to fetch the data
    const getPaitentIds = async () => {
        try {
            setLoading(true);

            const response = await getPatientById();

            setPatientIDs(response.data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return(

        <div className = "topHalf"> 
           <h1> Add Patient Record </h1>

            <p> Register a new hospital admission with all 12 required patient fields. </p>


            <div className = "addPatientDetailsCon"> 

          
                    <p className = "patientTxtID" > Patient ID </p>
                    <input name = "PatientID" className = "inputPatientID"  placeholder = "UKH-1061" />

                 
                     <p className = "patientTxtName" > Patient Name </p>
                    <input name = "PatientID" className = "inputPatientName"  placeholder = "Full Name" />
                

                    <p className = "patientAge" > Patient Age </p>
                    <input name = "PatientID" className = "inputPatientAge"  placeholder = "e.g. 54" />
                  

                    <p className = "patientTxtGender" > Patient Gender </p>
                    <select name = "PatientName" className = "inputpatientGender">
                        <option value = "temp"> Female </option>
                        <option value = "temp"> Male </option>
                        <option value = "temp"> Non-binary </option>
                    </select> 
                    

                        <p className = "patientTxtCity" > Patient City </p>
                        <input name = "PatientID" className = "inputPatientCity"  placeholder = "London" />
                    

                        <p className = "patientTxtDept" > Departments </p>
                        <select name = "PatientName" className = "inputPatientDept">
                            <option> Ophthalmology </option>
                            <option> Pediatrics </option>
                            <option> Emergency Medicine </option>
                            <option> Nephrology </option>
                            <option> Maternity </option>
                            <option> Neurology </option>
                            <option> ENT </option>
                            <option> Dermatology </option>
                            <option> Urology </option>
                            <option> Gastroenterology </option>
                            <option> Oncology </option>
                            <option> Orthopedics </option>
                            <option> General Surgery </option>
                            <option> Respiratory Medicine </option>
                            <option> Cardiology </option>
                        </select> 
                    
 
                        <p className = "patientTxtDate" > Admission Date </p>
                        <div className = "selectPatientAddDateAdd"> 
                            <p className = "AdmissionDate"> 14/09/2026 </p>
                            <MdDateRange className = "dateIcon"/> 
                        </div>
                   

                        <p className = "patientTxtDiagnosis" > Diagnosis </p>
                        <input name = "PatientDiagnosis" className = "inputPatientDiagnosis"  placeholder = "Atrial Fibrillation" />


                        <p className = "patientTxtDr" > Doctor Assigned </p>
                        <input name = "PatientID" className = "inputPatientIDDr"  placeholder = "e.g Dr Eleanor Vance" />


                        <p className = "patientTxtStat" > Status </p>
                        <select name = "PatientStatus" className = "inputPatientStat">
                            <option> Admitted </option>
                            <option> Discharged </option>
                            <option> Under Treatment </option>
                        </select> 
        

                        <p className = "patientTxtStay" > Length of stay (days) </p>
                        <input name = "PatientID" className = "inputPatientStay"  placeholder = "6" />
        

                        <p className = "patientTxtCost" > Treatment Cost (£) </p>
                        <input name = "PatientID" className = "inputPatientCost"  placeholder = "1432" />

                     <button className = "btnAddPerson" type = "button" >
                        <IoPersonAddOutline className = "addpersonIcon"/> Add Patient
                     </button> 




            </div>
        </div>

        

    )

}