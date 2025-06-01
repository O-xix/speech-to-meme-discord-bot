import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { registerCommand } from "../commandStore";
import {
    AudioReceiveStream,
    EndBehaviorType,
    joinVoiceChannel,
} from "@discordjs/voice";
import { Model, Recognizer } from "vosk-koffi";
import { OpusEncoder } from "@discordjs/opus";
import path from "node:path";
import { clearTimeout } from "node:timers";
import { findMeme, interpretVoiceCommand } from "../search";

const SAMPLE_RATE = 48000;

const model = new Model(path.join(__dirname, "../../model"));
const encoder = new OpusEncoder(SAMPLE_RATE, 1);

registerCommand(
    "join",
    new SlashCommandBuilder()
        .setName("join")
        .setDescription("Add Speech-to-Meme to your current voice channel."),
    async (interaction) => {
        if (
            !interaction.guild ||
            !interaction.channel ||
            !interaction.channel.isSendable()
        ) {
            await interaction.reply(
                "This command can only be used in a guild!",
            );
            return;
        }

        await interaction.deferReply();

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
                duration: 900000,
            },
        });

        // Start processing.
        handleAudioStream(interaction, recv);

        await interaction.editReply("Joined!");
    },
);

function handleAudioStream(
    interaction: ChatInputCommandInteraction,
    recv: AudioReceiveStream,
) {
    const recognizer = new Recognizer({
        model,
        sampleRate: SAMPLE_RATE,
    });

    // Stores the ID of a timeout that triggers when the user
    // stops speaking.
    // TODO: There should be another timeout to limit the max
    //       speech length.
    let handleEndTimeoutID: NodeJS.Timeout | null = null;

    // This stores the list of words that have been seen so far.
    let curResult: string[] = [];

    recv.on("data", (chunk) => {
        // Data comes in opus format.
        const data = encoder.decode(chunk);

        // Give the audio to the recognizer.
        // If it has data for us to process, add it to
        // the list of words.
        // TODO: Make async (needs handling to ensure in-order processing).
        if (recognizer.acceptWaveform(data)) {
            // @ts-expect-error The types for the library are wrong.
            curResult.push(...recognizer.result()["text"].split(" "));

            // Return so that we don't restart
            // handleEndTimeoutID, since this is packet was
            // silent.
            // This has the potential to prevent the final
            // handling code from running, but that's only if
            // the only audio packet sent was silence,
            // which means we didn't receive a command anyway,
            // so it won't cause issues.
            return;
        }

        if (handleEndTimeoutID != null) clearTimeout(handleEndTimeoutID);
        handleEndTimeoutID = setTimeout(async () => {
            // Process the final result (which didn't get handled
            // by the code above).
            // @ts-expect-error The types for the library are wrong.
            curResult.push(...recognizer.finalResult()["text"].split(" "));

            // Take the full words list for processing,
            // allowing further requests to be handled
            // asynchronously.
            const words = curResult;
            curResult = [];

            // Check if this is a command.
            // If it is, extract the search query.
            const searchQuery = interpretVoiceCommand(words);
            if (!searchQuery) {
                // Not a command.
                // Try again next sentence.
                return;
            }

            const meme = await findMeme(
                interaction.guild!.id,
                searchQuery.join(" "),
            );

            if (meme) {
                // Send meme.
                if (interaction.channel!.isSendable()) {
                    await interaction.channel.send(
                        `<@${interaction.user.id}> sent meme ${meme.name}:`,
                    );
                    await interaction.channel.send(meme.url);

                    return;
                }
            } else {
                // No meme found.
                // Inform the user, if possible.
                if (interaction.channel!.isSendable()) {
                    await interaction.channel.send({
                        content: `<@${interaction.user.id}> no meme found for query "${searchQuery.join(" ")}"!`,
                    });
                    return;
                }
            }
        }, 1000);
    });
}
