// Convert DD/MM/YYYY or YYYY-MM-DD into a valid JavaScript Date
export const parseDate = (date) => {
    if (!date) return null;

    // Handle DD/MM/YYYY
    if (typeof date === 'string' && date.includes('/')) {
        const [day, month, year] = date.split('/').map(Number);

        if (!day || !month || !year) return null;

        const parsedDate = new Date(year, month - 1, day);

        // Validate the actual calendar date
        if (
            parsedDate.getFullYear() !== year ||
            parsedDate.getMonth() !== month - 1 ||
            parsedDate.getDate() !== day
        ) {
            return null;
        }

        return parsedDate;
    }

    // Handle YYYY-MM-DD or existing Date values
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return null;
    }

    return parsedDate;
};