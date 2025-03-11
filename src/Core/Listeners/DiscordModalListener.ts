import { ModalSubmitInteraction } from "discord.js";
import DiscordListener from "@/Core/Listeners/DiscordListener";

export default abstract class DiscordModalEvent extends DiscordListener {
	/**
	 * Handles the event execution.
	 */
	public abstract execute(interaction: ModalSubmitInteraction): Promise<unknown>;
}
