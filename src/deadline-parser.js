/**
 * Parse user date input into a valid datetime
 * Supports formats:
 * - YYYY-MM-DD
 * - YYYY-MM-DD HH:mm
 */

function parseDeadlineDate(dateInput) {
    dateInput = dateInput.trim();
    
    // Try YYYY-MM-DD HH:mm format
    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(dateInput)) {
        return parseDateWithTime(dateInput);
    }
    
    // Try YYYY-MM-DD format (assume 23:59:59)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return parseDateOnly(dateInput);
    }
    
    return {
        error: `❌ Invalid date format: \`${dateInput}\`\n\nSupported formats:\n• \`YYYY-MM-DD\` (deadline at 11:59pm UTC)\n• \`YYYY-MM-DD HH:mm\` (specific time in UTC)`
    };
}

function parseDateWithTime(dateInput) {
    try {
        const dueTime = new Date(`${dateInput}:00Z`);
        const now = new Date();
        
        if (dueTime <= now) {
            return { error: "❌ Deadline cannot be in the past" };
        }
        
        return {
            dueTime,
            description: dueTime.toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
        };
    } catch (e) {
        return { error: "Invalid date/time format" };
    }
}

function parseDateOnly(dateInput) {
    try {
        // Parse as YYYY-MM-DD and set to 23:59:59 UTC
        const dueTime = new Date(`${dateInput}T23:59:59Z`);
        const now = new Date();
        
        if (dueTime <= now) {
            return { error: "❌ Deadline cannot be in the past" };
        }
        
        return {
            dueTime,
            description: dateInput + ' (11:59pm UTC)'
        };
    } catch (e) {
        return { error: "Invalid date format" };
    }
}

module.exports = { parseDeadlineDate };
