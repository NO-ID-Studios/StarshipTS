import { EmbedStatus } from "@/Types/Embed";
import { EmbedBuilder } from "discord.js";

export default class Embed {
	public static getBaseEmbedBuilder(): EmbedBuilder {
		return new EmbedBuilder()
			.setFooter({ text: "StarshipTS" })
			.setTimestamp();
	}

	public static getBaseErrorEmbed() {
		return this.getBaseEmbedBuilder()
			.setColor(EmbedStatus.ERROR);
	}

	public static getBaseSuccessEmbed() {
		return this.getBaseEmbedBuilder()
			.setColor(EmbedStatus.SUCCESS);
	}

	public static getValidationErrorEmbed(fields: string[]) {
		return this.getBaseErrorEmbed()
			.setTitle("Validation Error.")
			.setDescription("One or more inputs were invalid - check and try again.")
			.setFields([
				{
					name: "Invalid Fields",
					value: `\`\`\`${ fields.join(", ") }\`\`\``
				}
			]);
	}
}
