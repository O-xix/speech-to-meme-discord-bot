import Fuse from "fuse.js";
import { getMemes, Meme } from "./database/meme";

/**
 * Attempts to search through a guild's database for a meme,
 * returning null if none was found.
 * @param guildID - is the ID of the guild to search through.
 * @param query - is the query for the meme name.
 */
export async function findMeme(
    guildID: string,
    query: string,
): Promise<Meme | null> {
    const memes = await getMemes(guildID);

    const search = new Fuse(memes, {
        keys: ["name"],
    });

    const res = search.search(query, { limit: 1 });
    if (res.length === 0) return null;

    const item = res[0];
    // TODO: Enforce minimum score.

    return item.item;
}

/**
 * Determines if spoken words match a voice command, and,
 * if so, extract the user's search query from it.
 *
 * Returns null if it isn't a valid command, a list
 * of search query words if it is.
 * @param command - a word-separated list of spoken words.
 */
export function interpretVoiceCommand(command: string[]): string[] | null {
    // Remove stopwords (e.g. "the", "a", "an").
    const commandNoStops = command.filter(
        (word) =>
            !["a", "an", "and", "the", "that", "at", "it", "then"].includes(
                word,
            ),
    );

    // Keep looking for matches while there are enough words.
    // Format: "discord send meme ..."
    // Therefore, minimum length is 3.
    while (commandNoStops.length >= 3) {
        // The "discord send meme" part.
        const trigger = commandNoStops.slice(0, 3).join(" ");

        const validTriggers = [
            "discord send meme",
            "discord send memes",
            "discord send me",
            "discord sent meme",
            "discord sent memes",
            "discord sent me",
            "discord sand meme",
            "discord sand memes",
            "discord sand me",
            "cord send meme",
            "cord send memes",
            "cord send me",
            "cord sent meme",
            "cord sent memes",
            "cord sent me",
            "cord sand meme",
            "cord sand memes",
            "cord sand me",
        ];

        // Ensure that it's a command.
        if (!validTriggers.includes(trigger)) {
            // Invalid command.
            // Let's try starting one to the right.
            commandNoStops.shift();
            continue;
        }

        // The rest of the words are the search query.
        return commandNoStops.slice(3);
    }

    // Not found.
    return null;
}
