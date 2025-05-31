import { SlashCommandBuilder } from "discord.js";
import { registerCommand } from "../commandStore";

registerCommand(
    "ping",
    new SlashCommandBuilder().setName("ping").setDescription("Test command"),
    async (interaction) => {
        await interaction.reply("Pong!");
    },
);
