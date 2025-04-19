import pino from "pino";
import Bot from "@/Core/Bot";
import { isDevelop } from "@/System/Environment";
import Environment from "@/Core/Environment";

const { name } = Environment;
const verbosity = isDevelop ? "debug" : "info";
const logger = pino({
	name,
	level: verbosity
});

const starship = new Bot(logger);

process.on("SIGINT", async () => {
	logger.info("Gracefully shutting down...");

	await starship.shutdown();
});

starship.start();
