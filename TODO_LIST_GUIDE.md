## 📋 Study To-Do List Feature

Commands for managing your study tasks in Discord.

### Commands

#### `/addtask`
Add a new task to your to-do list.
- **task** (required): "Read Chapter 5"
- **subject** (optional): "Biology"
- **due_date** (optional): "2026-04-15"

Example:
```
/addtask task: "Study for midterm" subject: "Calculus" due_date: "2026-04-20"
```

#### `/tasks`
View all your pending and completed tasks.
- Shows task ID, subject, and due date
- ✅ = completed task
- ⬜ = pending task

#### `/removetask`
Delete a task from your list.
- **task_id** (required): The ID from `/tasks` list

Example:
```
/removetask task_id: 3
```

#### `/completetask`
Mark a task as completed.
- **task_id** (required): The ID from `/tasks` list

Example:
```
/completetask task_id: 1
```

#### `/cleartasks`
Delete all your tasks at once.
- Use with caution - cannot be undone!

### How Tasks Are Stored

Tasks are stored in a JSON file (`data/tasks.json`):
- Each task has a unique ID
- Auto-increments (1, 2, 3, etc.)
- Each user's tasks are separate

### Example Workflow

1. Add a task:
   ```
   /addtask task: "Complete essay" subject: "English" due_date: "2026-04-12"
   ```
   → Response: Task added with ID `1`

2. View your tasks:
   ```
   /tasks
   ```
   → Shows: "⬜ Complete essay (ID: 1) - English - Due: 2026-04-12"

3. Mark as complete:
   ```
   /completetask task_id: 1
   ```
   → Response: Task 1 marked complete

4. View tasks again:
   ```
   /tasks
   ```
   → Shows: "✅ ~~Complete essay~~ (ID: 1) - English - Due: 2026-04-12"

5. Delete task:
   ```
   /removetask task_id: 1
   ```
   → Response: Task removed

### File Structure

```
data/
└── tasks.json          # All user tasks (created automatically)
```

### Task Data Structure

Each task stores:
- `id` - Unique number (auto-increments)
- `user_id` - Discord user ID (private per user)
- `task` - The task text
- `subject` - Subject/course (optional)
- `due_date` - When it's due (optional)
- `completed` - true/false status
- `created_at` - When it was created
