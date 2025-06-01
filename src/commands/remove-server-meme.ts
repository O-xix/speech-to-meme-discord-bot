import { SlashCommandBuilder } from "discord.js";
import { registerCommand } from "../commandStore";
import { removeMeme, getMemes } from "../database/meme";

registerCommand(
    "remove-server-meme",
    new SlashCommandBuilder()
        .setName("remove-server-meme")
        .setDescription("Remove a meme from the server's list of memes.")
        .addStringOption((option) =>
            option
                .setName("meme")
                .setDescription("The meme to remove")
                .setRequired(true),
        ),
    async (interaction) => {
        if (!interaction.guild) {
            await interaction.reply(
                "This command can only be used in a guild!",
            );
            return;
        }

        const memeName = interaction.options.getString("meme", true);
        const guildID = interaction.guild.id;

        // Optional: Check if meme exists before removing
        const memes = await getMemes(guildID);
        const memeExists = memes.some((m) => m.name === memeName);

        if (!memeExists) {
            await interaction.reply(
                `The meme "${memeName}" is not in the server's list.`,
            );
            return;
        }

        await removeMeme(guildID, memeName);
        await interaction.reply(
            `Removed meme: "${memeName}" from the server's list.`,
        );
    },
);
