import Embed from "@/Core/Utils/Embed";
import { Interaction } from "@/Discord/Client";
import Validator from "@/Core/Utils/Validator";
import DiscordEvent from "@/Core/Listeners/DiscordListener";

export default class DiscordInteractionListener extends DiscordEvent {
	/**
	 * Handles incoming chat commands.
	 * 
	 * I would like to fix this and use better typings to get the desired functionality. Currently
	 * there is a good amount of repeat code that can be cleaned up.
	 */
	public async execute(interaction: Interaction): Promise<void> {
		if (interaction.isModalSubmit()) {
			// By default we should validate our Modal inputs so the bot can handle this flow
			const validatedFields = Validator.validate(interaction.fields);

			if (validatedFields.length > 0) {
				await interaction.reply({ embeds: [ Embed.getValidationErrorEmbed(validatedFields) ], flags: "Ephemeral" });

				return;
			}

			try {
				const commandName = interaction.customId.split("-")[0];
				const command = interaction.client.commands.get(commandName);

				await command?.execute(interaction);
			} catch (error) {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: "There was an error while executing this command!", flags: "Ephemeral" });
				} else {
					await interaction.reply({ content: "There was an error while executing this command!", flags: "Ephemeral" });
				}
			}
		} else if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command.hasPermission(interaction)) {
				await interaction.reply({ content: "Insufficient Permissions.", flags: "Ephemeral" });

				return;
			}

			try {
				await command?.execute(interaction);
			} catch (error) {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: "There was an error while executing this command!", flags: "Ephemeral" });
				} else {
					await interaction.reply({ content: "There was an error while executing this command!", flags: "Ephemeral" });
				}
			}
		} else if (interaction.isButton()) {
			try {
				const commandName = interaction.customId.split("-")[0];
				const command = interaction.client.commands.get(commandName);

				await command?.execute(interaction);
			} catch (error) {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: "There was an error while executing this command!", flags: "Ephemeral" });
				} else {
					await interaction.reply({ content: "There was an error while executing this command!", flags: "Ephemeral" });
				}
			}
		}
	}
}
