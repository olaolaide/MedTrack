// importing all the parts :D
import {useEffect, useState } from "react";
import ErrorState from "../components/ErrorState.jsx";
import { addPatient } from "../services/patientService";
import { IoIosSearch } from "react-icons/io";
import LoadingState from "../components/LoadingState.jsx";
import {getPatientById} from"../services/patientService";
import { data } from "react-router-dom";


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
                 <div className = "patientIdADD"> 
                    <p className = "patientTxt" > Patient ID </p>
                    <input name = "PatientID" className = "inputPatientID"  placeholder = "UKH-1061" />
                </div>

                 <div className = "patientNameADD"> 
                    <p className = "patientTxt" > Patient Name </p>
                    <input name = "PatientID" className = "inputPatientID"  placeholder = "Full Name" />
                </div>

                   <div className = "patientAgeADD"> 
                    <p className = "patientTxt" > Patient Age </p>
                    <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                </div>

                   <div className = "patientGenderADD"> 
                        <p className = "patientTxt" > Patient Gender </p>
                        <select name = "PatientName" className = "patientNameSelect">
                            <option value = "temp"> temp </option>
                            <option value = "temp"> temp2 </option>
                            <option value = "temp"> temp3 </option>
                        </select> 
                     </div>

                    <div className = "patientCityADD"> 
                        <p className = "patientTxt" > Patient City </p>
                        <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                    </div>

                    <div className = "patientDepartmentADD"> 
                        <p className = "patientTxt" > Patient Department </p>
                        <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                    </div>


                     <div className = "patientDatetADD"> 
                        <p className = "patientTxt" > Admission Date </p>
                        <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                    </div>

                     <div className = "patientDiagnosisADD"> 
                        <p className = "patientTxt" > Diagnosis </p>
                        <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                    </div>

                     <div className = "patientDoctorADD"> 
                        <p className = "patientTxt" > Doctor Assigned </p>
                        <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                    </div>

                    <div className = "patientStatusADD"> 
                        <p className = "patientTxt" > Status </p>
                        <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                    </div>

                    <div className = "patientDurationADD"> 
                        <p className = "patientTxt" > Length of stay (days) </p>
                        <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                    </div>

                    <div className = "patientCostADD"> 
                        <p className = "patientTxt" > Treatment Cost (£) </p>
                        <input name = "PatientID" className = "inputPatientID"  placeholder = "e.g. 54" />
                    </div>

                     <button className = "btnSearch" type = "button" >
                        <IoIosSearch className = "srcIcon"/> Load record
                     </button>




            </div>
        </div>

        

    )

}