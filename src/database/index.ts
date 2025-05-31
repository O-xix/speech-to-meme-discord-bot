import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

/**
 * The local SQLite database, used for persistent storage.
 */
export let db: Database = null!;

/**
 * Required to run before the database can be used.
 */
export async function setupDatabase() {
    db = await open({ filename: "database.db", driver: sqlite3.Database });

    await db.run(
        "CREATE TABLE IF NOT EXISTS memes (guildID TEXT, authorID TEXT, name TEXT, url TEXT, UNIQUE(guildID, name))",
    );
    await db.run("CREATE INDEX IF NOT EXISTS memes_guildID ON memes (guildID)");
}
