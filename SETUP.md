## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `discord.js` - Discord bot framework
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
npm start
# or with nodemon:
npx nodemon src/index.js
```

You should see:
```
YourBotName is online!
✅ Reminder check loop started!
```

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
│   ├── storage.js            # In-memory reminder storage
│   ├── tasks-storage.js      # JSON-based task storage
│   ├── reminder-parser.js    # Time format parsing
│   └── reminder-loop.js      # Background reminder checker
├── data/
│   └── tasks.json            # User tasks (created automatically)
├── package.json
├── .env                      # Your bot token
```

## How It Works

### Study Reminders
1. User runs `/studyremind` with title and time
2. Bot parses the time (supports 5+ formats)
3. Reminder stored in memory
4. Background task checks every 30 seconds for due reminders
5. When due, bot sends DM (or falls back to channel message)
6. Reminder marked as delivered
7. **Note:** Reminders are lost when bot restarts (stored in memory)

### Study To-Do List
1. User runs `/addtask` with task details
2. Bot stores task in JSON file (`data/tasks.json`)
3. User can view, complete, or delete tasks
4. **Tasks persist across bot restarts** (saved in JSON)
