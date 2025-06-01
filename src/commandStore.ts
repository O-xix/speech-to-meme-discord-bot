import {
    ChatInputCommandInteraction,
    REST,
    Routes,
    SharedSlashCommand,
} from "discord.js";

/**
 * Every slash command, including their data
 * and corresponding handler function.
 */
export const commands: Record<
    string,
    {
        data: SharedSlashCommand;
        execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    }
> = {};

/**
 * Registers a slash command.
 * This must happen during initialization.
 * @param name - is the command's name ("/NAME")
 * @param data - is the SlashCommandBuilder used to specify the command.
 * @param execute - is a function that will be called when the command is invoked.
 */
export function registerCommand(
    name: string,
    data: SharedSlashCommand,
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>,
) {
    if (name !== data.name) {
        throw new Error(
            `Command name ${name} does not match SlashCommandBuilder name ${data.name}!`,
        );
    }

    if (commands[name]) {
        throw new Error(`Command ${name} already exists!`);
    }

    commands[name] = { data, execute };
}

/**
 * Publishes all slash commands to Discord, making
 * them available to users.
 * @param clientID - is the bot's client ID.
 * @param token - is the bot's token.
 */
export async function publishCommands(clientID: string, token: string) {
    const commandData = [];

    for (const command in commands) {
        commandData.push(commands[command].data.toJSON());
    }

    const rest = new REST().setToken(token);

    await rest.put(
        // TODO: Replace with Routes.applicationCommands
        Routes.applicationGuildCommands(clientID, "1356749588912017564"),
        {
            body: commandData,
        },
    );
}
