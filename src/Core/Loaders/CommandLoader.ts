import fs from "fs";
import path from "path";
import Plugin from "@/Core/Plugins/Plugin";
import Command from "@/Core/Command";

export default class CommandLoader {
	/**
	 * Handles the loading of commands.
	 */
	public static async loadCommands(folderPath: string, plugin: Plugin<unknown>): Promise<Command[]> {
		if (!fs.existsSync(folderPath)) {
			return;
		}

		const folders = fs.readdirSync(folderPath);
		const commandPromises = folders.flatMap(folder => {
			const subCommandPath = path.join(folderPath, folder);
			const files = fs.readdirSync(subCommandPath).filter(f => f.endsWith(".ts"));

			return files.map(commandFile => {
				const filePath = path.join(subCommandPath, commandFile);

				return import(filePath);
			});
		});

		const modules = await Promise.all(commandPromises);

		return modules.map(module => {
			const commandInstance: Command = new module.default(plugin);

			commandInstance.register();

			if ("name" in commandInstance && "execute" in commandInstance) {
				return commandInstance as Command;
			} else {
				throw new Error(`The command at ${ module } failed to load.`);
			}
		});
	}
}
