import { SlashCommandBuilder } from "discord.js";
import { registerCommand } from "../commandStore";

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

        const serverMemes = interaction.client.serverMemes.get(interaction.guild.id);
        if (!serverMemes || serverMemes.length === 0) {
            await interaction.reply("No server memes found.");
            return;
        }

        const memeList = serverMemes.map((meme, index) => `${index + 1}. ${meme}`).join("\n");
        await interaction.reply(`Server Memes:\n${memeList}`);
    }
);