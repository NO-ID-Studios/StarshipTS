import pino from "pino";
import Bot from "@/Core/Bot";
import { config } from "dotenv";
import { isDevelop } from "@/System/Environment";

config();

const { BOT_NAME } = process.env;
const verbosity = isDevelop ? "debug" : "info";
const logger = pino({
	name: BOT_NAME,
	level: verbosity
});

const starship = new Bot(logger);

process.on("SIGINT", async () => {
	logger.info("Gracefully shutting down...");

	await starship.shutdown();
});

starship.start();
