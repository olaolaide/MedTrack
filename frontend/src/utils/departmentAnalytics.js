export const getDepartmentAnalytics = (summary) => {
    const departments = summary?.departments ?? [];
    const totals = summary?.totals ?? {};

    if (!departments.length) {
        return null;
    }

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
        .reduce((total, dept) => total + (dept.PatientShare ?? 0), 0)
        .toFixed(1);

    // Cost distribution
    const totalCost = Math.max(totals.TotalTreatmentCost ?? 0, 1);

    const topTwoCostShare = (
        topTwoDepts.reduce(
            (total, dept) => total + (dept.TotalTreatmentCost ?? 0),
            0
        ) / totalCost * 100
    ).toFixed(1);

    const longestCostShare = (
        (longestStayDept.TotalTreatmentCost ?? 0) / totalCost * 100
    ).toFixed(1);

    // Maximum average length of stay (chart scaling)
    const maxStay = Math.max(
        ...deptsByStay.map((dept) => Math.round(dept.AverageLengthOfStay ?? 0)),
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
        totalPatients: totals.NumberOfPatients ?? 0,
        totalTreatmentCost: totals.TotalTreatmentCost ?? 0,
        averageLengthOfStay: totals.AverageLengthOfStay ?? 0,
        averageCostPerPatient: totals.CostPerPatient ?? 0,
    };
};