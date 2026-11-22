const normalizeDepartment = (dept) => ({
    ...dept,
    Department: dept.Department ?? dept.department ?? "Unknown",
    NumberOfPatients: Number(dept.NumberOfPatients ?? dept.patientCount ?? 0),
    PatientShare: Number(dept.PatientShare ?? dept.sharePercent ?? 0),
    AverageLengthOfStay: Number(
        dept.AverageLengthOfStay ?? dept.avgLengthOfStay ?? 0
    ),
    TotalTreatmentCost: Number(
        dept.TotalTreatmentCost ?? dept.totalTreatmentCost ?? 0
    ),
    CostPerPatient: Number(
        dept.CostPerPatient ?? dept.avgCostPerPatient ?? 0
    ),
});

export const getDepartmentAnalytics = (summary) => {
    const rawDepartments = summary?.departments ?? [];
    const totals = summary?.totals ?? summary ?? {};

    if (!rawDepartments.length) {
        return null;
    }

    const departments = rawDepartments.map(normalizeDepartment);

    // Sort departments by a specified numeric property
    const sortBy = (key, order = "desc") =>
        [...departments].sort((a, b) =>
            order === "desc"
                ? b[key] - a[key]
                : a[key] - b[key]
        );

    // Department rankings
    const deptsByStay = sortBy("AverageLengthOfStay");
    const deptsByCost = sortBy("TotalTreatmentCost");
    const deptsByCostPerPatient = sortBy("CostPerPatient", "asc");
    const deptsByCaseload = sortBy("NumberOfPatients");

    // Top-performing departments
    const longestStayDept = deptsByStay[0];
    const highestCostDept = deptsByCost[0];
    const lowestCostPerPatientDept = deptsByCostPerPatient[0];
    const secondLowestCostDept = deptsByCostPerPatient[1] ?? null;

    // Top two departments by patient volume
    const topTwoDepts = deptsByCaseload.slice(0, 2);

    const topTwoShare = topTwoDepts
        .reduce((total, dept) => total + dept.PatientShare, 0)
        .toFixed(1);

    // Cost distribution
    const rawTotalCost =
        totals.TotalTreatmentCost ?? totals.overallTotalCost ?? 0;
    const totalCost = Math.max(Number(rawTotalCost) || 0, 1);

    const topTwoCostShare = (
        (topTwoDepts.reduce(
                (total, dept) => total + dept.TotalTreatmentCost,
                0
            ) /
            totalCost) *
        100
    ).toFixed(1);

    const longestCostShare = (
        (longestStayDept.TotalTreatmentCost / totalCost) *
        100
    ).toFixed(1);

    // Maximum average length of stay (chart scaling)
    const maxStay = Math.max(
        ...deptsByStay.map((dept) => Math.round(dept.AverageLengthOfStay)),
        1
    );

    return {
        // Sorted department collections
        deptsByStay,
        deptsByCost,
        deptsByCostPerPatient,
        deptsByCaseload,

        // Department insights
        longestStayDept,
        highestCostDept,
        lowestCostPerPatientDept,
        secondLowestCostDept,

        // Caseload insights
        topTwoDepts,
        topTwoShare,
        topTwoCostShare,
        longestCostShare,

        // Chart configuration
        maxStay,

        // Hospital-wide totals
        totalPatients: Number(
            totals.NumberOfPatients ?? totals.totalPatients ?? 0
        ),
        totalTreatmentCost: Number(
            totals.TotalTreatmentCost ?? totals.totalTreatmentCost ?? 0
        ),
        averageLengthOfStay: Number(
            totals.AverageLengthOfStay ?? totals.averageLengthOfStay ?? 0
        ),
        averageCostPerPatient: Number(
            totals.CostPerPatient ?? totals.averageCostPerPatient ?? 0
        ),
    };
};