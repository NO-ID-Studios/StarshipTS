import { Logger } from "pino";
import { Interaction } from "discord.js";

export default abstract class DiscordListener {
	constructor(protected logger?: Logger) {
		//
	}

	/**
	 * Handles the event interaction.
	 */
	public abstract execute(interaction: Interaction, ...restArgs: unknown[]): Promise<unknown>;
}
