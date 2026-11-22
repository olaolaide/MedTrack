export const DEPARTMENT_COLORS = {
    'Emergency Medicine': '#009d9a',
    Maternity: '#8a3ffc',
    Ophthalmology: '#6929c4',
    Oncology: '#a56eff',
    Urology: '#ba4e00',
    Pediatrics: '#ee5396',
    'Respiratory Medicine': '#24a148',
    Neurology: '#198038',
    Orthopedics: '#ff832b',
    Gastroenterology: '#fa4d56',
    ENT: '#ff7eb6',
    Cardiology: '#0f62fe',
    'General Surgery': '#0043ce',
    Nephrology: '#525252',
    Dermatology: '#f1c21b',
};

export function getDepartmentColor(department) {
    return DEPARTMENT_COLORS[department] || '#526176';
}

export function formatCurrencyGBP(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatNumber(value) {
    return new Intl.NumberFormat('en-GB').format(value);
}

export const formatDays = (days) => {
    const rounded = Math.round(Number(days ?? 0));
    return `${rounded} ${rounded === 1 ? "day" : "days"}`;
};