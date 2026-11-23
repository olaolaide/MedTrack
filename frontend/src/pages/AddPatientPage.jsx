// importing all the parts :D
import {useEffect, useState } from "react";
import ErrorState from "../components/ErrorState.jsx";
import { addPatient } from "../services/patientService";
import { IoIosSearch } from "react-icons/io";
import LoadingState from "../components/LoadingState.jsx";


export default function AddPatientPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [success, setSuccess] = useState(null);

    return(

        <div className = "topHalf"> 


        </div>

    )
    
}