import { SlashCommandBuilder } from "discord.js";
import { registerCommand } from "../commandStore";
import { createMeme } from "../database/meme"; // Import the function

registerCommand(
    "add-server-meme",
    new SlashCommandBuilder()
        .setName("add-server-meme")
        .setDescription("Add a meme to the server's list of memes.")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the meme")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("url")
                .setDescription("The URL of the meme image")
                .setRequired(true)
        ),
    async (interaction) => {
        if (!interaction.guild) {
            await interaction.reply(
                "This command can only be used in a guild!",
            );
            return;
        }

        const name = interaction.options.getString("name", true);
        const url = interaction.options.getString("url", true);
        const guildID = interaction.guild.id;
        const authorID = interaction.user.id;

        try {
            await createMeme(guildID, authorID, name, url);
            await interaction.reply(`Added meme: "${name}" to the server's list.`);
        } catch (err) {
            await interaction.reply(`Failed to add meme: ${err}`);
        }
    }, 
)