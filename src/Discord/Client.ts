import { Collection, Client as DiscordClient, Interaction as DiscordInteraction } from "discord.js";

export class Client extends DiscordClient {
	commands: Collection<string, any>;
}

export type Interaction = DiscordInteraction & {
	client: Client;
}
