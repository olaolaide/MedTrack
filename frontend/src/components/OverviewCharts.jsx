import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
} from "recharts";
import {formatCurrencyGBP, formatDays, formatNumber, getDepartmentColor} from "../utils/helper.js";

const tooltipStyle = {
    borderRadius: "8px",
    borderColor: "#e4e9f0",
    fontSize: "12px",
};

const axisTickStyle = {
    fontSize: 11,
    fill: "#526176",
};


const OverviewCharts = ({
                            deptsByCaseload,
                            deptsByCost,
                            deptsByStay,
                            totalPatients,
                            averageLengthOfStay,
                            maxStay,

                        }) => {
    return (
        <section
            className="charts-grid"
            aria-label="Hospital department analytics"
        >
            {/* Caseload Share */}
            <div className="panel">
                <h2 className="panel-title">
                    Caseload share
                </h2>

                <div
                    className="donut-box"
                    style={{position: "relative", height: 270, width: "100%"}}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={deptsByCaseload}
                                dataKey="NumberOfPatients"
                                nameKey="Department"
                                cx="50%"
                                cy="50%"
                                innerRadius="54%"
                                outerRadius="88%"
                                paddingAngle={2}
                                stroke="none"
                            >
                                {deptsByCaseload.map((entry) => (
                                    <Cell
                                        key={entry.Department}
                                        fill={getDepartmentColor(entry.Department)}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value, name) => [
                                    `${Number(value ?? 0)} patients`,
                                    String(name ?? ""),
                                ]}
                                contentStyle={tooltipStyle}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div
                        className="donut-center"
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                            textAlign: "center",
                        }}
                    >
                        <strong style={{whiteSpace: "nowrap"}}>
                            {formatNumber(totalPatients)}
                        </strong>
                        <span>patients</span>
                    </div>
                </div>

                <div className="legend">
                    {deptsByCaseload.map((dept) => (
                        <div
                            key={dept.Department}
                            className="legend-item"
                        >
                            <span
                                className="legend-dot"
                                style={{
                                    backgroundColor: getDepartmentColor(
                                        dept.Department
                                    ),
                                }}
                                aria-hidden="true"
                            />

                            <span className="legend-label">
                                {dept.Department}
                            </span>

                            <b>
                                {Number(dept.PatientShare ?? 0).toFixed(1)}%
                            </b>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total Cost Per Department */}
            <div className="panel">
                <h2 className="panel-title">
                    Total cost per department
                </h2>

                <div className="chart-box-tall">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={deptsByCost}
                            layout="vertical"
                            margin={{
                                top: 4,
                                right: 16,
                                left: 6,
                                bottom: 4,
                            }}
                            barSize={10}
                        >
                            <XAxis
                                type="number"
                                hide
                            />

                            <YAxis
                                type="category"
                                dataKey="Department"
                                width={165}
                                interval={0}
                                tickMargin={8}
                                axisLine={false}
                                tickLine={false}
                                tick={axisTickStyle}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "#f5f7fb",
                                }}
                                formatter={(value) => [
                                    formatCurrencyGBP(
                                        Number(value ?? 0)
                                    ),
                                    "Total cost",
                                ]}
                                contentStyle={tooltipStyle}
                            />

                            <Bar
                                dataKey="TotalTreatmentCost"
                                radius={[6, 6, 6, 6]}
                                background={{
                                    fill: "#f0f3f8",
                                    radius: 6,
                                }}
                            >
                                {deptsByCost.map((entry) => (
                                    <Cell
                                        key={entry.Department}
                                        fill={getDepartmentColor(
                                            entry.Department
                                        )}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-summary-strip">
                    {deptsByCost.map((dept) => (
                        <div
                            key={dept.Department}
                            className="chart-summary-item"
                        >
                            <span>
                                {dept.Department}
                            </span>

                            <strong>
                                {formatCurrencyGBP(
                                    dept.TotalTreatmentCost
                                )}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>

            {/* Average Length of Stay */}
            <div className="panel panel-span-2">
                <h2 className="panel-title">
                    Average length of stay
                </h2>

                <p className="panel-description">
                    Dashed marker represents the hospital average of{" "}
                    <strong>
                        {averageLengthOfStay.toFixed(1)} days
                    </strong>.
                </p>

                <div className="chart-box-stay">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={deptsByStay}
                            layout="vertical"
                            margin={{
                                top: 8,
                                right: 28,
                                left: 6,
                                bottom: 8,
                            }}
                            barSize={10}
                        >
                            <XAxis
                                type="number"
                                domain={[
                                    0,
                                    Math.ceil(maxStay + 1),
                                ]}
                                hide
                            />

                            <YAxis
                                type="category"
                                dataKey="Department"
                                width={165}
                                interval={0}
                                tickMargin={8}
                                axisLine={false}
                                tickLine={false}
                                tick={axisTickStyle}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "#f5f7fb",
                                }}
                                formatter={(value) => [
                                    `${formatDays(value)}`,
                                    "Average stay",
                                ]}
                                contentStyle={tooltipStyle}
                            />

                            <ReferenceLine
                                x={averageLengthOfStay}
                                stroke="#8c96a5"
                                strokeDasharray="4 4"
                                strokeWidth={2}
                            />

                            <Bar
                                dataKey="AverageLengthOfStay"
                                radius={[6, 6, 6, 6]}
                                background={{
                                    fill: "#f0f3f8",
                                    radius: 6,
                                }}
                            >
                                {deptsByStay.map((entry) => (
                                    <Cell
                                        key={entry.Department}
                                        fill={getDepartmentColor(
                                            entry.Department
                                        )}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

export default OverviewCharts;
