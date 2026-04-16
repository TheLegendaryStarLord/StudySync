/**
 * Parse user input into a datetime object
 * Supports multiple formats:
 * - Relative: "10m", "1h", "2h30m"
 * - 12-hour: "7:00pm", "2:30pm"
 * - 24-hour: "19:00", "14:30"
 * - ISO: "2026-04-10 19:00"
 */

function parseReminderTime(timeInput) {
    timeInput = timeInput.trim();
    
    // Try relative time
    if (/^\d+[mh](\d+[mh])?$/i.test(timeInput)) {
        return parseRelativeTime(timeInput);
    }
    
    // Try 12-hour format
    if (/[ap]m/i.test(timeInput)) {
        return parse12HourTime(timeInput);
    }
    
    // Try 24-hour format
    if (/^\d{1,2}:\d{2}$/.test(timeInput)) {
        return parse24HourTime(timeInput);
    }
    
    // Try ISO datetime
    if (/^\d{4}-\d{2}-\d{2}/.test(timeInput)) {
        return parseISODateTime(timeInput);
    }
    
    return {
        error: `❌ Invalid time format: \`${timeInput}\`\n\nSupported formats:\n• Relative: \`10m\`, \`1h\`, \`2h30m\`\n• 12-hour: \`7:00pm\`\n• 24-hour: \`19:00\`\n• ISO: \`2026-04-10 19:00\``
    };
}

function parseRelativeTime(timeInput) {
    try {
        timeInput = timeInput.toLowerCase();
        let minutes = 0;
        let hours = 0;
        
        const hoursMatch = timeInput.match(/(\d+)h/);
        if (hoursMatch) hours = parseInt(hoursMatch[1]);
        
        const minutesMatch = timeInput.match(/(\d+)m/);
        if (minutesMatch) minutes = parseInt(minutesMatch[1]);
        
        if (hours === 0 && minutes === 0) {
            return { error: "Time must be greater than 0" };
        }
        
        const now = new Date();
        const dueTime = new Date(now.getTime() + (hours * 60 + minutes) * 60000);
        
        let description;
        if (hours > 0 && minutes > 0) {
            description = `in ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            description = `in ${hours}h`;
        } else {
            description = `in ${minutes}m`;
        }
        
        return { dueTime, description };
    } catch (e) {
        return { error: "Error parsing relative time" };
    }
}

function parse12HourTime(timeInput) {
    try {
        // Parse 12-hour format: "7:00pm" or "2:30am"
        const timeRegex = /(\d{1,2}):(\d{2})\s*(am|pm)/i;
        const match = timeInput.match(timeRegex);
        
        if (!match) return { error: "Invalid 12-hour time format" };
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toLowerCase();
        
        // Convert to 24-hour format
        if (period === 'pm' && hours !== 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;
        
        const now = new Date();
        let dueTime = new Date(now);
        dueTime.setHours(hours, minutes, 0, 0);
        
        // If time has passed, schedule for tomorrow
        if (dueTime <= now) {
            dueTime.setDate(dueTime.getDate() + 1);
        }
        
        const timeStr = dueTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
        return { dueTime, description: `at ${timeStr} UTC` };
    } catch (e) {
        return { error: "Invalid 12-hour time format" };
    }
}

function parse24HourTime(timeInput) {
    try {
        const [hoursStr, minutesStr] = timeInput.split(':');
        const hours = parseInt(hoursStr);
        const minutes = parseInt(minutesStr);
        
        const now = new Date();
        let dueTime = new Date(now);
        dueTime.setHours(hours, minutes, 0, 0);
        
        // If time has passed, schedule for tomorrow
        if (dueTime <= now) {
            dueTime.setDate(dueTime.getDate() + 1);
        }
        
        const timeStr = dueTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        return { dueTime, description: `at ${timeStr} UTC` };
    } catch (e) {
        return { error: "Invalid 24-hour time format" };
    }
}

function parseISODateTime(timeInput) {
    try {
        const dueTime = new Date(timeInput);
        const now = new Date();
        
        if (dueTime <= now) {
            return { error: "❌ Reminder time cannot be in the past" };
        }
        
        const dateStr = dueTime.toISOString().slice(0, 16).replace('T', ' ');
        return { dueTime, description: `on ${dateStr} UTC` };
    } catch (e) {
        return { error: "Invalid ISO datetime format" };
    }
}

module.exports = { parseReminderTime };
