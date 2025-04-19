import path from "path";
import Bot from "@/Core/Bot";
import { Logger } from "pino";
import { Express } from "express";
import { Sequelize } from "sequelize";
import Configurable from "@/Core/Configurable";
import CommandLoader from "@/Core/Loaders/CommandLoader";
import ConfigurationLoader from "@/Core/Loaders/ConfigurationLoader";

export default abstract class Plugin<ConfigType = object> extends Configurable<ConfigType> {
	private logger: Logger;
	private loadedCommands: string[];

	constructor(protected name: string, protected bot: Bot) {
		super();

		this.logger = bot.getLogger().child({ module: name });
		this.loadedCommands = [];
	}

	/**
	 * Mount the plugin.
	 */
	public async mount(): Promise<void> {
		try {
			const loadedConfiguration = await ConfigurationLoader.loadConfiguration(this.getFolderPath());
			this.config = loadedConfiguration.settings;

			if (!loadedConfiguration.enabled) {
				return;
			}

			await this.loadCommands();
			await this.initializeDatabase(this.bot.getDatabase());
			this.initializeListeners();
			this.registerRoutes(this.getBot().getWebServer());
		} catch (error) {
			this.logger.error(`An error has occurred when mounting plugin '${ this.name }': ${ error }`);
		}
	}

	/**
	 * Unmount the plugin.
	 */
	public abstract unmount(): Promise<void>;

	/**
	 * Loads the commands.
	 */
	private async loadCommands(): Promise<void> {
		const commandsDirectory = path.join(__dirname, `../../../plugins/${ this.name }/Commands`);
		const loadedCommands = await CommandLoader.loadCommands(commandsDirectory, this);

		if (!loadedCommands) {
			return;
		}

		loadedCommands.forEach(command => {
			this.loadedCommands.push(command.getName());

			this.bot.getDiscordClient()
				.commands
				.set(command.getName(), command);
		});
	}

	/**
	 * Initialize event listeners.
	 */
	protected abstract initializeListeners(): void;

	/**
	 * Initialize the database.
	 */
	protected abstract initializeDatabase(database: Sequelize): Promise<void>;

	/**
	 * Called on mount to register routes to the webserver.
	 */
	protected abstract registerRoutes(server: Express): void;

	/**
	 * Gets the current plugins folder path.
	 */
	protected getFolderPath() {
		return path.join(__dirname, `../../../plugins/${ this.name }`);
	}

	/**
	 * Gets the base bot.
	 */
	public getBot() {
		return this.bot;
	}

	/**
	 * Gets the plugin name.
	 */
	public getName() {
		return this.name;
	}

	/**
	 * Gets the logger instance.
	 */
	public getLogger() {
		return this.logger;
	}
}