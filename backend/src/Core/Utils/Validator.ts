import { ModalSubmitFields } from "discord.js";

export default abstract class Validator {
	public static validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		return emailRegex.test(email);
	}

	public static validateDiscordId(discordId: string): boolean {
		const discordIdRegex = /^\d{17,20}$/

		return discordIdRegex.test(discordId);
	}

	public static validateSteamId(steamId: string): boolean {
		const steam64Regex = /^\d{17}$/;

		return steamId.startsWith("7656") && steam64Regex.test(steamId);
	}

	public static validateExpires(expiration: string): boolean {
		const expirationRegex = /^0|[1-9]\d*$/;

		return expirationRegex.test(expiration);
	}

	public static validateNumber(numberString: string): boolean {
		return !isNaN(parseInt(numberString));
	}

	public static validate(fields: ModalSubmitFields): string[] {
		return fields.fields.map((component, key) => {
			if (!component.value) {
				return;
			}

			if (key.includes("email")) {
				return !this.validateEmail(component.value) ? "Email" : null;
			} else if (key.includes("steam")) {
				return !this.validateSteamId(component.value) ? "Steam ID" : null;
			} else if (key.includes("expires")) {
				return !this.validateExpires(component.value) ? "Expires" : null;
			} else if (key.includes("number")) {
				return !this.validateNumber(component.value) ? "Number" : null;
			}
		}).filter(val => !!val);
	}
}
