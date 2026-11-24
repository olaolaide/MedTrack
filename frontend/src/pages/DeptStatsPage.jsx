// importing
import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState.jsx";
import StatCard from "../components/StatCard.jsx";
import { getDepartmentStats } from "../services/patientService";
import { getDepartmentSummary } from "../services/patientService";
import { formatCurrencyGBP } from "../utils/helper.js";
import { IoIosCash, IoIosPeople, IoIosStats, IoIosTime } from "react-icons/io";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function DeptStatsPage() {
    const [department, setDepartment] = useState("");
    const [departments, setDepartments] = useState([]);
    const [hospital, setHospital] = useState(null);
    const [stats, setStats] = useState(null);
    const [deptInfo, setDeptInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Run function when the page actually runs
    useEffect(() => {
        getDepartments();
    }, [])


    // using async/await to fetch all the departments
    const getDepartments = async () => {
        try {
            setLoading(true);

            const summary = await getDepartmentSummary();

            setDepartments(summary.departments);
            setHospital(summary.totals);

        } catch (err) {
            setError("Unable to load departments");
        } finally {
            setLoading(false);
        }
    };

    // when the department dropdown changes
    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
        setError(null);
    };

    // gets the stats for the picked department using the task 1.8 endpoint
    const handleGetStats = async () => {
        if (department === "") {
            setError("Please select a department");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setStats(null);
            setDeptInfo(null);

            const response = await getDepartmentStats(department);

            if (response.data.data.length === 0) {
                setError("No patients found for this department");
            } else {
                setStats(response.data.data[0]);

                // find the same department in the summary to get the patient count
                for (let i = 0; i < departments.length; i++) {
                    if (departments[i].Department === department) {
                        setDeptInfo(departments[i]);
                    }
                }
            }

        } catch (err) {
            setError("Unable to load department stats");
        } finally {
            setLoading(false);
        }
    };

    // data for the two charts
    let stayChart = [];
    let costChart = [];

    if (stats && deptInfo && hospital) {
        stayChart = [
            { name: deptInfo.Department + " Avg", value: Math.round(stats.AverageLengthOfStay * 10) / 10 },
            { name: "Hospital Avg", value: Math.round(hospital.AverageLengthOfStay * 10) / 10 }
        ];

        costChart = [
            { name: deptInfo.Department + " Avg", value: Math.round(deptInfo.CostPerPatient) },
            { name: "Hospital Avg", value: Math.round(hospital.CostPerPatient) }
        ];
    }

    return(

        <div className = "page-stack">
            <div className = "page-header">
                <div>
                    <h1> Department statistics </h1>
                    <p> Inspect total treatment cost and average length of stay for any selected hospital department. </p>
                </div>
            </div>

            <div className = "panel">
                <div className = "deptFormRow">
                    <div className = "deptSelectCon">
                        <p className = "formLabel"> Department </p>
                        <select name = "Department" className = "formInput" value = {department} onChange = {handleDepartmentChange}>
                            <option value = ""> Select a department </option>

                            {departments.map((dept) => (
                                <option key = {dept.Department} value = {dept.Department}>
                                    {dept.Department}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        className = "button button-full"
                        type = "button"
                        onClick = {handleGetStats}
                        disabled = {loading}
                    >
                        <IoIosStats /> Get Department Stats
                    </button>
                </div>

                {error && <p className = "errorText"> {error} </p>}
            </div>

            {loading && <LoadingState />}

            {/* the 4 cards and 2 charts */}
            {stats && deptInfo && hospital && (
                <div className = "page-stack">
                    <div className = "stats-grid">
                        <StatCard
                            icon = {IoIosCash}
                            color = "purple"
                            label = "Total treatment cost"
                            value = {formatCurrencyGBP(stats.TotalTreatmentCost)}
                            detail = {deptInfo.Department + " total spend"}
                        />

                        <StatCard
                            icon = {IoIosTime}
                            color = "green"
                            label = "Average length of stay"
                            value = {stats.AverageLengthOfStay.toFixed(1) + " days"}
                            detail = {"Hospital avg: " + hospital.AverageLengthOfStay.toFixed(1) + " days"}
                        />

                        <StatCard
                            icon = {IoIosPeople}
                            color = "blue"
                            label = "Patients in department"
                            value = {deptInfo.NumberOfPatients}
                            detail = {deptInfo.PatientShare.toFixed(1) + "% of hospital caseload"}
                        />

                        <StatCard
                            icon = {IoIosStats}
                            color = "orange"
                            label = "Average cost per patient"
                            value = {formatCurrencyGBP(deptInfo.CostPerPatient)}
                            detail = {"Hospital avg: " + formatCurrencyGBP(hospital.CostPerPatient)}
                        />
                    </div>

                    <div className = "charts-grid">
                        <div className = "panel">
                            <h2 className = "panel-title"> Average length of stay vs. hospital benchmark (days) </h2>

                            {/* makes the chart as wide as the box */}
                            <ResponsiveContainer width = "100%" height = {240}>
                                <BarChart data = {stayChart}>
                                    <CartesianGrid strokeDasharray = "3 3" vertical = {false} />
                                    <XAxis dataKey = "name" axisLine = {false} tickLine = {false} />
                                    <YAxis axisLine = {false} tickLine = {false} />
                                    <Tooltip />
                                    <Bar dataKey = "value" barSize = {30}>
                                        <Cell fill = "#0f62fe" />
                                        <Cell fill = "#94a3b8" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className = "panel">
                            <h2 className = "panel-title"> Average cost per patient vs. hospital benchmark (£) </h2>

                            <ResponsiveContainer width = "100%" height = {240}>
                                <BarChart data = {costChart}>
                                    <CartesianGrid strokeDasharray = "3 3" vertical = {false} />
                                    <XAxis dataKey = "name" axisLine = {false} tickLine = {false} />
                                    <YAxis axisLine = {false} tickLine = {false} />
                                    <Tooltip />
                                    <Bar dataKey = "value" barSize = {30}>
                                        <Cell fill = "#0f62fe" />
                                        <Cell fill = "#94a3b8" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
