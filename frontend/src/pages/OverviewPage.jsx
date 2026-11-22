import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {
    Clock,
    PoundSterling,
    TrendingUp,
    Users,
} from 'lucide-react';

import {
    formatCurrencyGBP,
    formatNumber,
    formatDays,
} from '../utils/helper.js';

import {getDepartmentAnalytics} from '../utils/departmentAnalytics';
import {getDepartmentSummary} from '../services/patientService.js';

import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatCard from "../components/StatCard";
import InsightCard from "../components/InsightCard.jsx";
import OverviewCharts from "../components/OverviewCharts.jsx";

export default function OverviewPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                            : 'Unable to load hospital summary.'
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
        deptsByStay,
        deptsByCost,
        deptsByCaseload,

        longestStayDept,
        highestCostDept,
        lowestCostPerPatientDept,
        secondLowestCostDept,

        topTwoDepts,
        topTwoShare,
        topTwoCostShare,
        longestCostShare,

        maxStay,
        totalPatients,
        totalTreatmentCost,
        averageLengthOfStay,
        averageCostPerPatient,
    } = analytics;

    return (
        <div className="page-stack">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Overview</h1>
                    <p>
                        The hospital at a glance. Open the summary page
                        for the full table.
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <section
                aria-label="Key hospital metrics"
                className="stats-grid"
            >
                <StatCard
                    icon={Users}
                    color="blue"
                    label="Total patients"
                    value={formatNumber(totalPatients)}
                    detail={`Across ${summary.departments.length} departments`}
                />

                <StatCard
                    icon={Clock}
                    color="green"
                    label="Average length of stay"
                    value={formatDays(averageLengthOfStay)}
                    detail={`Longest: ${longestStayDept.Department}, ${formatDays(longestStayDept.AverageLengthOfStay)}`}
                />

                <StatCard
                    icon={PoundSterling}
                    color="purple"
                    label="Total treatment cost"
                    value={formatCurrencyGBP(totalTreatmentCost)}
                    detail={`Highest: ${highestCostDept.Department}, ${formatCurrencyGBP(highestCostDept.TotalTreatmentCost)}`}
                />

                <StatCard
                    icon={TrendingUp}
                    color="orange"
                    label="Cost per patient"
                    value={formatCurrencyGBP(averageCostPerPatient)}
                    detail={`Lowest: ${lowestCostPerPatientDept.Department}, ${formatCurrencyGBP(lowestCostPerPatientDept.CostPerPatient)}`}
                />
            </section>


            <OverviewCharts
                deptsByCaseload={deptsByCaseload}
                deptsByCost={deptsByCost}
                deptsByStay={deptsByStay}
                totalPatients={totalPatients}
                averageLengthOfStay={averageLengthOfStay}
                maxStay={maxStay}
            />


            {/* Clinical Insight Cards */}

            <section aria-label="Clinical insights" className="insights-grid">
                <InsightCard
                    title="Longest average stay"
                    value={`${longestStayDept.Department}, ${formatDays(longestStayDept.AverageLengthOfStay)}`}
                    description={`The hospital average is ${formatDays(averageLengthOfStay)} ${longestStayDept.Department} accounts for ${longestCostShare}% of total treatment cost.`}
                />

                <InsightCard
                    title="Lowest cost per patient"
                    value={`${lowestCostPerPatientDept.Department}, ${formatCurrencyGBP(lowestCostPerPatientDept.CostPerPatient)}`}
                    description={`The hospital average is ${formatCurrencyGBP(averageCostPerPatient)}. ${
                        secondLowestCostDept
                            ? `${secondLowestCostDept.Department} is next lowest at ${formatCurrencyGBP(secondLowestCostDept.CostPerPatient)}.`
                            : ""
                    }`}
                />

                <InsightCard
                    title="Caseload concentration"
                    value={topTwoDepts
                        .map((dept) => dept.Department)
                        .join(" and ")}
                    description={`Together they hold ${topTwoShare}% of patients and ${topTwoCostShare}% of total treatment cost.`}
                />
            </section>

            {/* Quick Links */}
            <section className="quick-links">
                <span className="quick-links-title">
                    Quick actions:
                </span>

                <Link
                    to="/add"
                    className="button button-outline"
                >
                    Add Patient
                </Link>

                <Link
                    to="/update"
                    className="button button-outline"
                >
                    Update Record
                </Link>

                <Link
                    to="/long-stay"
                    className="button button-outline"
                >
                    Long Stay Top 10
                </Link>

                <Link
                    to="/summary"
                    className="button"
                >
                    Open Department Summary
                </Link>
            </section>
        </div>
    );
}
