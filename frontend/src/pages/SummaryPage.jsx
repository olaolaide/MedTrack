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
    }, []);

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
                            <th className="numeric">Number of Patients</th>
                            <th>Caseload Share</th>
                            <th className="numeric">Avg Length of Stay</th>
                            <th className="numeric">Total Treatment Cost</th>
                            <th className="numeric">Cost per Patient</th>
                            <th>Cost Benchmark</th>
                        </tr>
                        </thead>
                        <tbody>

                        </tbody>
                        <tfoot>
                        <tr>
                            <td>Hospital Total</td>
                            <td className="numeric">
                                {formatNumber(totalPatients)}
                            </td>
                            <td className="tabular-nums">100.0%</td>
                            <td className="numeric">
                                {formatDays(averageLengthOfStay)}
                            </td>
                            <td className="numeric">
                                {formatCurrencyGBP(totalTreatmentCost)}
                            </td>
                            <td className="numeric">
                                {formatCurrencyGBP(averageCostPerPatient)}
                            </td>
                            <td style={{color: "#5b6b7f", fontWeight: 500}}>
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
                    style={{ width: "100%", height: Math.max(300, deptsByCost.length * 44) }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={deptsByCost}
                            layout="vertical"
                            margin={{ top: 10, right: 24, left: 12, bottom: 10 }}
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
                                tick={{ fontSize: 12, fill: "#5b6b7f" }}
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
                                tick={{ fontSize: 12, fill: "#526176" }}
                            />
                            <Tooltip
                                cursor={{ fill: "#f5f7fb" }}
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