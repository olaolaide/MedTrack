import {useEffect, useState} from "react";
import {getDepartmentSummary} from "../services/patientService.js";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import {getDepartmentAnalytics} from "../utils/departmentAnalytics.js";
import EmptyState from "../components/EmptyState.jsx";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    formatCurrencyGBP,
    formatNumber,
    formatDays,
    getDepartmentColor,
} from "../utils/helper.js";

export default function SummaryPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        let active = true;

        const fetchSummary = async () => {
            try {
                const data = await getDepartmentSummary();

                if (active) setSummary(data);
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load hospital summary."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchSummary();

        return () => {
            active = false;
        };
    }, []);3

    if (loading) return <LoadingState/>;

    if (error || !summary) {
        return <ErrorState error={error}/>;
    }

    const analytics = getDepartmentAnalytics(summary);

    if (!analytics) return <EmptyState/>;

    const {
        maxStay,
        deptsByCost,
        totalPatients,
        totalTreatmentCost,
        averageLengthOfStay,
        averageCostPerPatient,
        deptsByCaseload,
    } = analytics;

    return (
        <div className="page-stack">
            <div className="page-header">
                <div>
                    <h1>Department summary</h1>
                    <p>
                        Patient volume, average length of stay, and total treatment cost
                        across every hospital department.
                    </p>
                </div>
            </div>

            <div className="table-panel">
                <div className="table-scroll">
                    <table className="summary-table">
                        <thead>
                        <tr>
                            <th>Department</th>
                            <th className="centered">Number of Patients</th>
                            <th className="centered">Caseload Share</th>
                            <th className="centered">Avg Length of Stay</th>
                            <th className="centered">Total Treatment Cost</th>
                            <th className="centered">Cost per Patient</th>
                            <th className="centered">Cost Benchmark</th>
                        </tr>
                        </thead>
                        <tbody>
                        {deptsByCaseload.map((dept) => {
                            const deptName = dept.Department ?? "Unknown";
                            const patientCount = Number(dept.NumberOfPatients ?? 0);
                            const sharePercent = Number(dept.PatientShare ?? 0);
                            const avgLengthOfStay = Number(dept.AverageLengthOfStay ?? 0);
                            const totalDeptCost = Number(dept.TotalTreatmentCost ?? 0);
                            const avgCostPerPatient = Number(dept.CostPerPatient ?? 0);

                            const color = getDepartmentColor(deptName);
                            const aboveAvg = avgCostPerPatient > averageCostPerPatient;

                            return (
                                <tr key={deptName}>
                                    <td>
                                        <span className="department-name">
                                            <span
                                                className="department-dot"
                                                style={{backgroundColor: color}}
                                                aria-hidden="true"
                                            >
                                                {deptName.charAt(0)}
                                            </span>
                                            <span>{deptName}</span>
                                        </span>
                                    </td>
                                    <td className="numeric centered">
                                        <strong>{formatNumber(patientCount)}</strong>
                                    </td>
                                    <td className='centered'>
                                        <div className="share-cell">
                                            <span className="mini-track">
                                                <span
                                                    style={{
                                                        width: `${Math.min(sharePercent, 100)}%`,
                                                        backgroundColor: color,
                                                    }}
                                                />
                                            </span>
                                            <span>{sharePercent.toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="numeric centered">
                                        <div className="metric-cell">
                                            <span className="mini-track">
                                                <span
                                                    style={{
                                                        width: `${Math.min(
                                                            (avgLengthOfStay / maxStay) * 100,
                                                            100
                                                        )}%`,
                                                        backgroundColor: color,
                                                    }}
                                                />
                                            </span>
                                            <span>{formatDays(avgLengthOfStay)}</span>
                                        </div>
                                    </td>
                                    <td className="numeric centered">
                                        <strong>{formatCurrencyGBP(totalDeptCost)}</strong>
                                    </td>
                                    <td className="numeric centered">
                                        {formatCurrencyGBP(avgCostPerPatient)}
                                    </td>
                                    <td className="centered">
                                        <span
                                            className={`cost-status ${aboveAvg ? "above" : "below"}`}
                                        >
                                            {aboveAvg ? "Above average" : "Below average"}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td>Hospital Total</td>
                            <td className="numeric centered">
                                {formatNumber(totalPatients)}
                            </td>
                            <td className="tabular-nums centered">100.0%</td>
                            <td className="numeric centered">
                                {formatDays(averageLengthOfStay)}
                            </td>
                            <td className="numeric centered">
                                {formatCurrencyGBP(totalTreatmentCost)}
                            </td>
                            <td className="numeric centered">
                                {formatCurrencyGBP(averageCostPerPatient)}
                            </td>
                            <td className='centered' style={{color: "#5b6b7f", fontWeight: 500}}>
                                Hospital baseline
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <p className="table-note">
                    Cost benchmark compares each department&apos;s average cost per patient
                    against the overall hospital average of{" "}
                    <strong className="tabular-nums">
                        {formatCurrencyGBP(averageCostPerPatient)}
                    </strong>
                    .
                </p>
            </div>

            <div className="panel">
                <h2 className="panel-title">Department treatment cost comparison (£)</h2>
                <div
                    className="chart-box-tall"
                    style={{width: "100%", height: Math.max(300, deptsByCost.length * 44)}}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={deptsByCost}
                            layout="vertical"
                            margin={{top: 10, right: 24, left: 12, bottom: 10}}
                            barSize={16}
                            barCategoryGap="24%"
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#edf0f4"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                tick={{fontSize: 12, fill: "#5b6b7f"}}
                                tickFormatter={(val) => `£${Math.round(val / 1000)}k`}
                            />
                            <YAxis
                                type="category"
                                dataKey="Department"
                                width={175}
                                interval={0}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                tick={{fontSize: 12, fill: "#526176"}}
                            />
                            <Tooltip
                                cursor={{fill: "#f5f7fb"}}
                                formatter={(val) => [
                                    formatCurrencyGBP(Number(val ?? 0)),
                                    "Total Cost",
                                ]}
                                contentStyle={{
                                    borderRadius: "8px",
                                    borderColor: "#e4e9f0",
                                    fontSize: "12px",
                                }}
                            />
                            <Bar dataKey="TotalTreatmentCost" radius={[0, 6, 6, 0]}>
                                {deptsByCost.map((entry) => (
                                    <Cell
                                        key={entry.Department}
                                        fill={getDepartmentColor(entry.Department)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}