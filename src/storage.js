// Simple in-memory reminder storage
let reminders = [];
let nextId = 1;

function addReminder(userId, guildId, channelId, title, notes, createdAt, dueAt) {
    const reminder = {
        id: nextId++,
        user_id: userId,
        guild_id: guildId,
        channel_id: channelId,
        title,
        notes,
        created_at: createdAt,
        due_at: dueAt,
        delivered: false
    };
    
    reminders.push(reminder);
    return reminder.id;
}

function getDueReminders() {
    const currentTime = new Date().toISOString();
    return reminders.filter(r => !r.delivered && r.due_at <= currentTime);
}

function markReminderDelivered(reminderId) {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
        reminder.delivered = true;
    }
}

function getUserReminders(userId) {
    return reminders
        .filter(r => r.user_id === userId && !r.delivered)
        .map(r => [r.id, r.title, r.notes, r.due_at, r.created_at])
        .sort((a, b) => new Date(a[3]) - new Date(b[3]));
}

function deleteReminder(reminderId, userId) {
    const index = reminders.findIndex(r => r.id === reminderId && r.user_id === userId);
    if (index !== -1) {
        reminders.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = {
    addReminder,
    getDueReminders,
    markReminderDelivered,
    getUserReminders,
    deleteReminder
};
