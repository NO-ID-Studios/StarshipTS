import { IBaseConfig } from "@/Types/Configuration";
import fs from "fs";

export default class ConfigurationLoader {
	/**
	 * Loads the plugins configuration file.
	 */
	static loadConfiguration(pluginFolderPath: string): Promise<IBaseConfig> {
		const configFilePath = `${ pluginFolderPath }/config.json`;

		if (!fs.existsSync(configFilePath)) {
			return null;
		}

		return import(configFilePath);
	}
}
