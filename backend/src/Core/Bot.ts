import { Logger } from "pino";
import { config } from "dotenv";
import { Sequelize } from "sequelize";
import { Client } from "@/Discord/Client";
import Environment from "@/Core/Environment";
import { isDevelop } from "@/System/Environment";
import PluginManager from "@/Core/Managers/PluginManager";
import WebServerService from "@/Core/Services/WebServerService";
import ChatCommandEvent from "@/Core/Listeners/DiscordInteractionListener";
import { ActivityType, Collection, Events, GatewayIntentBits, Guild, REST, Routes } from "discord.js";

config();

export default class Bot {
	private appId: string;
	private guildId: string;
	private discordToken: string;
	private client: Client;
	private database: Sequelize;
	private pluginManager: PluginManager;
	private webServerService: WebServerService;
	private isShuttingDown = false;

	constructor(protected logger: Logger) {
		const {
			discordAppId, guildId, discordToken, databaseName, databaseUser, databasePassword,
			databaseHost, databasePort
		} = Environment;

		this.appId = discordAppId;
		this.guildId = guildId;
		this.discordToken = discordToken;

		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildPresences
			]
		});

		this.client.commands = new Collection();
		this.database = new Sequelize(databaseName, databaseUser, databasePassword, {
			host: databaseHost,
			dialect: "mysql",
			port: databasePort,
			logging: isDevelop
		});

		this.pluginManager = new PluginManager(this);
		this.webServerService = new WebServerService(logger);
	}

	/**
	 * Starts the Discord bot.
	 */
	public async start() {
		if (!this.discordToken || !this.guildId || !this.appId) {
			throw new Error("Missing required environment variables.");
		}

		await this.pluginManager.initialize();

		this.registerEvents();
		this.registerDiscordCommands();

		this.client.login(this.discordToken)
			.then(() => {
				this.client.user.setActivity(Environment.activityMessage, { type: ActivityType.Watching });
				this.webServerService.start();
			});
	}

	public registerEvents(): void {
		this.client.on(Events.ClientReady, (client) => {
			this.logger.info(`Bot ready! Logged in as ${ client.user.tag }`);
		});

		const chatCommandEvent = new ChatCommandEvent();

		this.client.on(Events.InteractionCreate, chatCommandEvent.execute);
	}

	private registerDiscordCommands() {
		const rest = new REST().setToken(this.discordToken);

		(async () => {
			try {
				const data: any = await rest.put(
					Routes.applicationGuildCommands(this.appId, this.guildId),
					{ body: this.client.commands.map(command => command.getCommandBuilder().toJSON()) }
				);

				this.logger.info(`Successfully registered ${ data.length } application (/) commands.`);
			} catch (error) {
				this.logger.error(`An error occurred while registering commands: ${ error }`);
			}
		})();
	}

	public async shutdown(): Promise<void> {
		if (this.isShuttingDown) {
			this.getLogger().info("Bot is already shutting down.");

			return;
		}

		this.isShuttingDown = true;

		process.exit();
	}

	public async fetchGuild(): Promise<Guild> {
		let guild = this.client.guilds.cache.get(this.guildId);

		if (!guild) {
			await this.client.guilds.fetch();

			guild = this.client.guilds.cache.get(this.guildId);

			if (!guild) {
				throw new Error("Unabled to find the bots guild.");
			}
		}

		return guild;
	}

	/**
	 * Gets the client instance.
	 */
	public getDiscordClient() {
		return this.client;
	}

	/**
	 * Gets the logger instance.
	 */
	public getLogger() {
		return this.logger;
	}

	/**
	 * Gets the database instance.
	 */
	public getDatabase() {
		return this.database;
	}

	/**
	 * Service exposure method to grab the web server at the Bot level.
	 */
	public getWebServer() {
		return this.webServerService.getWebServer();
	}
}
