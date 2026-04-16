## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `discord.js` - Discord bot framework
- `better-sqlite3` - Local SQLite database
- `dotenv` - Environment variables

### 2. Register Commands

```bash
node src/register-commands.js
```

You should see:
```
Registering slash commands...
Slash commands were registered successfully!
```

### 3. Run the Bot

```bash
nodemon
```

You should see:
```
YourBotName is online!
✅ Reminder check loop started!
```

The database file (`data/studysync.db`) is created automatically on first run.

## Commands

### Study Reminders

#### `/studyremind`
Schedule a study reminder.
- `title` (required): "Calculus Chapter 5"
- `reminder_time` (required): "10m", "7:00pm", "2026-04-10 19:00"
- `notes` (optional): Extra details

#### `/myreminders`
View all your pending reminders with IDs and times.

#### `/cancelreminder`
Delete a specific reminder by its ID.

### Study To-Do List

#### `/addtask`
Add a new task to your to-do list.
- `task` (required): "Complete essay"
- `subject` (optional): "English"
- `due_date` (optional): "2026-04-15"

#### `/tasks`
View all your pending and completed tasks.

#### `/removetask`
Delete a task by ID.
- `task_id` (required): Task number from `/tasks`

#### `/completetask`
Mark a task as completed.
- `task_id` (required): Task number from `/tasks`

#### `/cleartasks`
Delete all your tasks (cannot be undone).

### Assignment Deadlines

#### `/adddeadline`
Add an assignment deadline.
- `title` (required): "Math Midterm"
- `due_date` (required): "2026-04-20" or "2026-04-20 14:00"
- `subject` (optional): "Calculus"
- `notes` (optional): "Chapters 1-5"

#### `/deadlines`
View all your assignment deadlines.
- Shows status emoji (⏳ normal, 🟠 72h, 🔴 24h, ❌ past)

#### `/upcoming`
View deadlines due within the next 7 days.
- Sorted by nearest due date first

#### `/updatedeadline`
Update an existing deadline.
- `deadline_id` (required): ID from `/deadlines`
- Other fields optional

#### `/removedeadline`
Delete a specific deadline by ID.

#### `/cleardeadlines`
Delete all your deadlines (cannot be undone).

## Supported Time Formats

| Format | Example |
|--------|---------|
| Relative | `10m`, `1h`, `2h30m` |
| 12-hour | `7:00pm`, `2:30am` |
| 24-hour | `19:00`, `14:30` |
| ISO | `2026-04-10 19:00` |

## File Structure

```
StudySync/
├── src/
│   ├── index.js              # Main bot file with all commands
│   ├── register-commands.js  # Slash command registration
│   ├── database.js           # SQLite database (reminders + tasks + deadlines)
│   ├── reminder-parser.js    # Study reminder time format parsing
│   ├── reminder-loop.js      # Background reminder checker
│   ├── deadline-parser.js    # Assignment deadline date format parsing
│   └── deadline-reminders.js # Background deadline reminder checker
├── data/
│   └── reminders.db          # SQLite database (created automatically)
├── package.json
└── .env                      # Your bot token
```

## How It Works

### Study Reminders
1. User runs `/studyremind` with title and time
2. Bot parses the time (supports 5+ formats)
3. Reminder stored in SQLite database
4. Background task checks every 30 seconds for due reminders
5. When due, bot sends DM (or falls back to channel message)
6. Reminder marked as delivered
7. **Reminders persist across bot restarts** ✅

### Study To-Do List
1. User runs `/addtask` with task details
2. Bot stores task in SQLite database
3. User can view, complete, or delete tasks
4. **Tasks persist across bot restarts** ✅

### Assignment Deadlines
1. User runs `/adddeadline` with assignment name and due date
2. Bot validates the date format (YYYY-MM-DD or YYYY-MM-DD HH:mm)
3. Deadline stored in SQLite database
4. Background task checks every minute for due reminders
5. Sends 24h before deadline and 1h before deadline
6. Reminders sent via DM (fallback to channel)
7. **Deadlines persist across bot restarts** ✅
8. **Reminders tracked to prevent duplicates** ✅

### Database
- Uses `better-sqlite3` for local SQLite storage
- All data stored in `data/reminders.db`
- Automatic schema creation on startup
- No external database server needed
