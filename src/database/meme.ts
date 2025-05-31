import { db } from "./index";

/**
 * A meme object, as stored in the database.
 */
export interface Meme {
    /**
     * The ID of the guild that the meme exists in.
     */
    guildID: string;

    /**
     * The ID of the user who created the meme.
     */
    authorID: string;

    /**
     * The name of the meme.
     */
    name: string;

    /**
     * The URL of the meme image.
     */
    url: string;
}

/**
 * Inserts a new meme into the database.
 * Errors if the meme already exists.
 * @param guildID - is the ID of the guild that the meme exists in.
 * @param authorID - is the ID of the user who created the meme.
 * @param name - is the name of the meme.
 * @param url - is the URL of the meme image.
 */
export async function createMeme(
    guildID: string,
    authorID: string,
    name: string,
    url: string,
) {
    await db.run(
        "INSERT INTO memes (guildID, authorID, name, url) VALUES (?, ?, ?, ?)",
        guildID,
        authorID,
        name,
        url,
    );
}

/**
 * Retrieves all memes from the specified guild.
 * @param guildID - is the guild ID to retrieve memes from.
 */
export async function getMemes(guildID: string): Promise<Meme[]> {
    const memes = await db.all(
        "SELECT guildID, authorID, name, url FROM memes WHERE guildID = ?",
        guildID,
    );

    return memes.map((row) => ({
        guildID: row["guildID"] as string,
        authorID: row["authorID"] as string,
        name: row["name"] as string,
        url: row["url"] as string,
    }));
}
