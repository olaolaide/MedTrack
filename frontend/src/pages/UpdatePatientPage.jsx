// importing all the parts :D
import {useEffect, useState } from "react";
import ErrorState from "../components/ErrorState.jsx";
import { updatePatient } from "../services/patientService";
import {getPatientById} from"../services/patientService";
import { IoIosSearch } from "react-icons/io";
import LoadingState from "../components/LoadingState.jsx";

export default function UpdatePatientPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [patientID, setPatientID] = useState(null);
    const [success, setSucess] = useState();

    const handleSearch  = async () => {
        if (!patientID.trim()) {
            setError("Please enter a correct patient ID")
            return;
        }
    }


   

    return (
        <div className = "topHalf"> 
            <h1> Update patient record </h1>
            <p> 
                Look up a patient by Patient ID and update any of their 11 clinical and billing fields
            </p>

            <div className = "selectPatientCon"> 
                <div className = "byName"> </div>

                 <div className = "byID"> </div>
        
            </div>


            <div className = "updatePatientCon"> 
        
            </div>

        
        </div>
    )

} 