import { SlashCommandBuilder } from "discord.js";
import { registerCommand } from "../commandStore";

registerCommand(
    "remove-server-meme",
    new SlashCommandBuilder()
        .setName("remove-server-meme")
        .setDescription("Remove a meme from the server's list of memes.")
        .addStringOption(option =>
            option.setName("meme")
                .setDescription("The meme to remove")
                .setRequired(true)
        ),
    async (interaction) => {
        if (!interaction.guild) {
            await interaction.reply(
                "This command can only be used in a guild!",
            );
            return;
        }

        const meme = interaction.options.getString("meme", true);
        const serverMemes = interaction.client.serverMemes.get(interaction.guild.id) || [];

        if (!serverMemes.includes(meme)) {
            await interaction.reply(`The meme "${meme}" is not in the server's list.`);
            return;
        }

        const updatedMemes = serverMemes.filter(m => m !== meme);
        interaction.client.serverMemes.set(interaction.guild.id, updatedMemes);

        await interaction.reply(`Removed meme: "${meme}" from the server's list.`);
    }
)