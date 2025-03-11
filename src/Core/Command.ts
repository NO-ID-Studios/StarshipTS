import Plugin from "@/Core/Plugins/Plugin";
import { CommandInteraction, Interaction, ModalBuilder, SlashCommandBuilder } from "discord.js";

export default abstract class Command<PluginType = Plugin> {
	protected commandBuilder: SlashCommandBuilder;

	constructor(protected name: string, protected description: string, protected plugin: PluginType) {
		//

		this.commandBuilder = new SlashCommandBuilder()
			.setName(name)
			.setDescription(description);
	}

	/**
	 * Runs all of the setup for the command.
	 */
	public abstract register(): void;

	/**
	 * Handles command interaction.
	 */
	public abstract execute(interaction: Interaction): Promise<unknown>;

	/**
	 * Determines if the member has permission to use the interaction.
	 */
	public hasPermission(interaction: Interaction): boolean {
		return true;
	};

	/**
	 * Gets the command name.
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Gets the command builder instance.
	 */
	public getCommandBuilder(): SlashCommandBuilder {
		return this.commandBuilder;
	}

	/**
	 * Gets the base modal with a custom ID.
	 * 
	 * This is less than ideal in OOP since it will take up memory on non-modal based plugins. This
	 * would be better of in its own abstract command
	 */
	public getBaseModal(modalId: string) {
		return new ModalBuilder()
			.setCustomId(`${ this.getName() }-${ modalId }`);
	}
}
