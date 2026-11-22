// importing all the parts :D
import {useEffect, useState } from "react";
import loadingState from "frontend/src/components/LoadingState.jsx";
import errorState from "frontend/src/components/ErrorState.jsx";
import { updatePatient } from "../services/patientService";
import {getPatientById} from"../services/patientService";
import {IoIosSearch} from "react-icons";
import LoadingState from "../components/LoadingState";

export default function UpdatePatientPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        let active = true; 

        // gets the get patient code and runs it 
        const fetchPatientId = async () => {
            try {
                const ID = await getPatientById

            } catch(err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            :"Unable to load patient ID"
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchPatientId();


         // gets the update patient code and runs it
        const updatePatient = async () => {
            useEffect (() => {
                let active

                try {

                } catch(err) {
                    if (active) {
                        setError(
                            err instanceof Error
                                ? err.message
                                :"Incorrect information given"
                        )
                    }

                }
            })
        
        };

        return () => {
            active = false;
        };
    }, []);

    if (loading) return <LoadingState/>

   

    return (
        <div class = "topHalf"> 
            <h1> Update patient record </h1>
            <p> 
                Look up a patient by Patient ID and update any of their 11 clinical and billing fields
            </p>

            <div class = "selectPanel">
                <table class = "selectTable"> 
                    <tr>
                        <th> Select existing patient </th>
                        <th> Or enter a patient id </th>

                    </tr>
                </table>
            </div>

            <div class = "editRecord"> 
                <table class = "editTable">
                    <tr>
                        <th> Editing Patient id:</th>
                    </tr>

                    <tr> 
                        <h4> Paitent Name </h4>
                        
                        <h4> Age(years) </h4>
                        <h4> Gender </h4>

                        {/* <button onClick={}> </button> */}
                    </tr>

                </table>
            </div>
        
        </div>
    )

} 