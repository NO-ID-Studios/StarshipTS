import { envGet } from "@/Core/Utils/Environment";
import { config } from "dotenv";

config();

export default {
	environment: envGet<string>("APP_ENV", "development"),

	name: envGet<string>("BOT_NAME", "Bot"),
	discordAppId: envGet<string>("DISCORD_APP_ID", ""),
	guildId: envGet<string>("GUILD_ID", ""),
	discordToken: envGet<string>("BOT_TOKEN", ""),
	activityMessage: envGet<string>("ACTIVITY_MESSAGE", "your Discord!"),

	databaseHost: envGet<string>("DATABASE_HOST", "localhost"),
	databasePort: envGet<number>("DATABASE_PORT", 3306),
	databaseName: envGet<string>("DATABASE_NAME", "homestead"),
	databaseUser: envGet<string>("DATABASE_USERNAME", "root"),
	databasePassword: envGet<string>("DATABASE_PASSWORD", "password"),

	webHost: envGet<string>("WEB_HOST", "127.0.0.1"),
	webPort: envGet<number>("WEB_PORT", 8080)
};
