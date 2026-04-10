// Simple in-memory task storage (like reminders)
let tasks = [];
let nextId = 1;

function addTask(userId, taskText, subject, dueDate) {
    const newTask = {
        id: nextId++,
        user_id: userId,
        task: taskText,
        subject: subject || null,
        due_date: dueDate || null,
        completed: false,
        created_at: new Date().toISOString()
    };
    
    tasks.push(newTask);
    return newTask;
}

function getUserTasks(userId) {
    return tasks
        .filter(t => t.user_id === userId)
        .sort((a, b) => a.id - b.id);
}

function completeTask(taskId, userId) {
    const task = tasks.find(t => t.id === taskId && t.user_id === userId);
    
    if (!task) return false;
    
    task.completed = true;
    return true;
}

function removeTask(taskId, userId) {
    const index = tasks.findIndex(t => t.id === taskId && t.user_id === userId);
    
    if (index === -1) return false;
    
    tasks.splice(index, 1);
    return true;
}

function clearAllTasks(userId) {
    tasks = tasks.filter(t => t.user_id !== userId);
}

module.exports = {
    addTask,
    getUserTasks,
    completeTask,
    removeTask,
    clearAllTasks
};
