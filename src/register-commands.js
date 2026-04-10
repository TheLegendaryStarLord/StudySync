require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'add',
        description : 'Adds two numbers.',
        options: [
            {
                name: 'first-number',
                description: 'The first number',
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: 'one',
                        value: 1,
                    },
                    {
                        name: 'two',
                        value: 2,
                    },
                    {
                        name: 'three',
                        value: 3,
                    },
                ],
                required: true,
            },
            {
                name: 'second-number',
                description: 'The second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            }
        ]
    },
    {
        name: 'studyremind',
        description: 'Schedule a study reminder',
        options: [
            {
                name: 'title',
                description: 'What do you need to study?',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'reminder_time',
                description: 'When? Examples: 10m, 1h, 7:00pm, 19:00, 2026-04-10 19:00',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'notes',
                description: 'Optional notes about what to study',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ]
    },
    {
        name: 'myreminders',
        description: 'View all your pending study reminders',
    },
    {
        name: 'cancelreminder',
        description: 'Cancel a pending study reminder',
        options: [
            {
                name: 'reminder_id',
                description: 'The ID of the reminder to cancel',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
        ]
    },
    // ===== STUDY TO-DO LIST COMMANDS =====
    {
        name: 'addtask',
        description: 'Add a task to your study to-do list',
        options: [
            {
                name: 'task',
                description: 'What task do you need to do?',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'subject',
                description: 'Subject or course (optional)',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: 'due_date',
                description: 'When is it due? (optional)',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ]
    },
    {
        name: 'tasks',
        description: 'View all your study tasks',
    },
    {
        name: 'removetask',
        description: 'Remove a task from your list',
        options: [
            {
                name: 'task_id',
                description: 'The ID of the task to remove',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
        ]
    },
    {
        name: 'completetask',
        description: 'Mark a task as completed',
        options: [
            {
                name: 'task_id',
                description: 'The ID of the task to complete',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
        ]
    },
    {
        name: 'cleartasks',
        description: 'Delete all your tasks (cannot be undone)',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Slash commands were registered successfully!');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }

})();