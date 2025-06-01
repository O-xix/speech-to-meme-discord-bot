import { SlashCommandBuilder } from "discord.js";
import { registerCommand } from "../commandStore";
import { getMemes } from "../database/meme";

registerCommand(
    "list-server-memes",
    new SlashCommandBuilder()
        .setName("list-server-memes")
        .setDescription("List all server memes with S2M."),
    async (interaction) => {
        if (!interaction.guild) {
            await interaction.reply(
                "This command can only be used in a guild!",
            );
            return;
        }

        const memes = await getMemes(interaction.guild.id);
        if (!memes || memes.length === 0) {
            await interaction.reply("No server memes found.");
            return;
        }

        const memeList = memes
            .map((meme, index) => `${index + 1}. ${meme.name} - ${meme.url}`)
            .join("\n");
        await interaction.reply(`Server Memes:\n${memeList}`);
    },
);
