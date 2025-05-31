import "dotenv/config";
import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import { commands, publishCommands } from "./commandStore";
import { setupDatabase } from "./database";

// Add commands.
import "./commands";

async function main() {
    await setupDatabase();

    // Register commands with Discord.
    await publishCommands(process.env.BOT_CLIENT_ID!, process.env.BOT_TOKEN!);

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = commands[interaction.commandName];

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`,
            );
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    });

    await client.login(process.env.BOT_TOKEN);
}

main();
