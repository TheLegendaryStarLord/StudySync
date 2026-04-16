const { EmbedBuilder } = require('discord.js');
const { getDeadlinesNeed24hReminder, getDeadlinesNeed1hReminder, mark24hReminderSent, mark1hReminderSent } = require('./database');

/**
 * Background task that checks for upcoming deadline reminders every minute
 * Sends reminders 24h before and 1h before deadlines
 */
function startDeadlineReminderLoop(client) {
    console.log('✅ Deadline reminder check loop started!');
    
    setInterval(async () => {
        try {
            // Check for 24h reminders
            const need24h = getDeadlinesNeed24hReminder();
            for (const deadline of need24h) {
                await sendDeadlineReminder(client, deadline, '24h');
                mark24hReminderSent(deadline.id);
            }
            
            // Check for 1h reminders
            const need1h = getDeadlinesNeed1hReminder();
            for (const deadline of need1h) {
                await sendDeadlineReminder(client, deadline, '1h');
                mark1hReminderSent(deadline.id);
            }
        } catch (error) {
            console.log(`❌ Error in deadline reminder loop: ${error.message}`);
        }
    }, 60000); // Check every minute
}

async function sendDeadlineReminder(client, deadline, timeframe) {
    try {
        const user = await client.users.fetch(deadline.user_id);
        const embed = createDeadlineReminderEmbed(deadline, timeframe);
        
        // Try to send DM first
        try {
            await user.send({ embeds: [embed] });
            console.log(`✅ ${timeframe} deadline reminder DM sent to ${user.username}`);
        } catch (dmError) {
            // DM failed, try channel
            try {
                const channel = await client.channels.fetch(deadline.channel_id);
                await channel.send({ content: `<@${deadline.user_id}>`, embeds: [embed] });
                console.log(`✅ ${timeframe} deadline reminder sent in channel`);
            } catch (channelError) {
                console.log(`❌ Failed to send deadline reminder: ${channelError.message}`);
            }
        }
    } catch (error) {
        console.log(`❌ Error sending deadline reminder: ${error.message}`);
    }
}

function createDeadlineReminderEmbed(deadline, timeframe) {
    const embed = new EmbedBuilder()
        .setTitle(`📌 Assignment Deadline Reminder - ${timeframe} away!`)
        .setColor(0xff9900)
        .setDescription(`**${deadline.title}**`);
    
    if (deadline.subject) {
        embed.addFields({ name: '📚 Subject', value: deadline.subject });
    }
    
    embed.addFields({ name: '🕐 Due', value: deadline.due_at });
    
    if (deadline.notes) {
        embed.addFields({ name: '📝 Notes', value: deadline.notes });
    }
    
    return embed;
}

module.exports = { startDeadlineReminderLoop };
