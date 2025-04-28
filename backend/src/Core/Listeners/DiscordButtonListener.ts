import { ButtonInteraction } from "discord.js";
import DiscordListener from "@/Core/Listeners/DiscordListener";

export default abstract class DiscordButtonEvent extends DiscordListener {
	/**
	 * Handles the event execution.
	 */
	public abstract execute(interaction: ButtonInteraction): Promise<unknown>;
}
