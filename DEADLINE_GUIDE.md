## 📌 Assignment Deadline Feature

Complete deadline management system for tracking and managing assignment due dates.

### Commands

#### `/adddeadline`
Add a new assignment deadline.
- **title** (required): "Math Midterm Exam"
- **due_date** (required): Date in format:
  - `YYYY-MM-DD` (deadline at 11:59pm UTC)
  - `YYYY-MM-DD HH:mm` (specific time in UTC)
- **subject** (optional): "Calculus"
- **notes** (optional): "Chapters 1-5"

Example:
```
/adddeadline title: "Physics Project" due_date: "2026-04-20 23:59" subject: "Physics 201" notes: "Group project"
```

#### `/deadlines`
View all your saved deadlines sorted by due date.
- Shows status with emoji:
  - ⏳ Normal deadline
  - 🟠 Due within 72 hours
  - 🔴 Due within 24 hours
  - ❌ Past due

#### `/upcoming`
View only deadlines due within the next 7 days.
- Shows time remaining (days or hours)
- Sorted by nearest due date first

#### `/updatedeadline`
Update an existing deadline.
- **deadline_id** (required): ID from `/deadlines`
- **title** (optional): New title
- **due_date** (optional): New due date
- **subject** (optional): New subject
- **notes** (optional): New notes

Example:
```
/updatedeadline deadline_id: 5 due_date: "2026-04-25 14:00" notes: "Updated deadline"
```

#### `/removedeadline`
Delete a specific deadline by ID.
- **deadline_id** (required): ID from `/deadlines`

Example:
```
/removedeadline deadline_id: 3
```

#### `/cleardeadlines`
Delete all your deadlines at once.
- **Warning:** Cannot be undone!

### Automatic Reminders

The bot automatically sends deadline reminders:

**24 hours before deadline:**
- Friendly reminder with assignment name and due date
- Sent by DM (falls back to channel if DM fails)
- Only sent once per deadline

**1 hour before deadline:**
- Last chance reminder
- Sent by DM (falls back to channel if DM fails)
- Only sent once per deadline

Reminders automatically check every minute and send when the time window is reached.

### Date Format Examples

| Input | Means |
|-------|-------|
| `2026-04-15` | April 15, 2026 at 11:59pm UTC |
| `2026-04-15 14:00` | April 15, 2026 at 2:00pm UTC |
| `2026-04-15 23:59` | April 15, 2026 at 11:59pm UTC |

**Note:** All times are in UTC. Verify your timezone!

### Example Workflow

**Step 1: Add a deadline**
```
/adddeadline title: "Essay due" due_date: "2026-04-20" subject: "English"
```
→ Response: Deadline added with ID `1`

**Step 2: View all deadlines**
```
/deadlines
```
→ Shows all your deadlines with status emojis

**Step 3: Check upcoming deadlines**
```
/upcoming
```
→ Shows only deadlines due within 7 days

**Step 4: Update a deadline**
```
/updatedeadline deadline_id: 1 due_date: "2026-04-22"
```
→ Deadline updated to April 22

**Step 5: Remove a deadline**
```
/removedeadline deadline_id: 1
```
→ Deadline deleted

### Storage

- All deadlines saved in SQLite database (`data/reminders.db`)
- Persists across bot restarts
- Private per user
- Each deadline stores:
  - ID (auto-increments)
  - Assignment title
  - Subject/course name
  - Due date/time
  - Notes
  - Reminder flags (24h sent, 1h sent)

### Reminder Behavior

- Bot checks for due reminders every minute
- Sends 24h reminder when deadline is 24 hours away
- Sends 1h reminder when deadline is 1 hour away
- Each reminder sent only once (tracked in database)
- If already past 24h window, skips 24h reminder and sends 1h reminder
- Attempts DM first, falls back to original channel
- Works even while bot is offline (catches up on startup)

### Testing

**Test 24h reminder:**
```
/adddeadline title: "Test deadline" due_date: "[tomorrow date]" subject: "Test"
```
→ Will receive 24h reminder

**Test 1h reminder:**
```
/adddeadline title: "Urgent deadline" due_date: "[date + 1 hour]" subject: "Test"
```
→ Will receive 1h reminder

**Test invalid date:**
```
/adddeadline title: "Past deadline" due_date: "2020-01-01" subject: "Test"
```
→ Error: "Deadline cannot be in the past"

**Test wrong format:**
```
/adddeadline title: "Wrong format" due_date: "April 20, 2026" subject: "Test"
```
→ Error with supported formats shown

### Troubleshooting

**"Deadline cannot be in the past"**
- Your due date is before current time
- Check timezone (times are in UTC)

**Not getting reminders?**
- Make sure bot has "Send Messages" permission
- Check if DMs are enabled (bot will use channel instead)
- Bot must be running when reminder time occurs
- Look at console for error messages

**Reminders sent multiple times?**
- Database corruption
- Try `/cleardeadlines` and re-add them

**Deadline ID not found?**
- Use `/deadlines` to see correct IDs
- Make sure you own that deadline
