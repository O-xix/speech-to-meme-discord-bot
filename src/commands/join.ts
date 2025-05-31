import { SlashCommandBuilder } from "discord.js";
import { registerCommand } from "../commandStore";
import { EndBehaviorType, joinVoiceChannel } from "@discordjs/voice";

registerCommand(
    "join",
    new SlashCommandBuilder()
        .setName("join")
        .setDescription("Add Speech-to-Meme to your current voice channel."),
    async (interaction) => {
        if (!interaction.guild) {
            await interaction.reply(
                "This command can only be used in a guild!",
            );
            return;
        }

        const member = await interaction.guild.members.fetch({
            user: interaction.user,
            // Bypass cache because user may
            // have just joined the channel.
            force: true,
            cache: false,
        });

        if (!member.voice.channel) {
            await interaction.reply(
                "You must be in a voice channel to use this command!",
            );
            return;
        }

        // TODO: Properly handle multiple users.
        const connection = joinVoiceChannel({
            channelId: member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        // TODO: Don't subscribe to the same user twice.
        const recv = connection.receiver.subscribe(member.id, {
            end: {
                behavior: EndBehaviorType.AfterInactivity,
                // 15 minutes.
                duration: 900,
            },
        });

        recv.on("data", (chunk) => {
            console.log("recv", chunk);
            // TODO: Process audio.
        });

        await interaction.reply("Joined!");
    },
);
