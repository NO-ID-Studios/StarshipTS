import fs from "fs";
import path from "path";
import type Bot from "@/Core/Bot";
import Plugin from "@/Core/Plugins/Plugin";

export default class PluginManager {
	private plugins: Plugin[];

	constructor(private bot: Bot) {
		this.plugins = [];
	}

	/**
	 * Initializes the PluginManager
	 */
	public async initialize(): Promise<void> {
		await this.discoverPlugins();
		await this.mountPlugins();
	}

	/**
	 * Helper to create the plugin instance.
	 */
	private async registerPlugin(modulePath: string, folder: string): Promise<void> {
		const pluginModule = await import(modulePath);
		const pluginInstance = new pluginModule.default(folder, this.bot);

		this.plugins.push(pluginInstance);

		this.bot.getLogger().debug(`Discovered plugin ${ folder }.`);
	}

	/**
	 * Attempt to discover a plugin by name.
	 */
	public async discoverPlugin(name: string): Promise<boolean> {
		const pluginPath = path.join(__dirname, `../../../plugins/${ name }`);

		if (!fs.existsSync(pluginPath)) {
			return false;
		}

		await this.registerPlugin(pluginPath, name);

		return true;
	}

	/**
	 * Discover the plugins in the 'plugins' directory.
	 */
	private async discoverPlugins() {
		const pluginBasePath = path.join(__dirname, "../../../plugins");

		if (!fs.existsSync(pluginBasePath)) {
			throw new Error(`Cannot find the plugin path at ${ pluginBasePath }`);
		}

		const pluginFolders = fs.readdirSync(pluginBasePath);
		const pluginPromises = pluginFolders.map(folder => {
			const pluginPath = path.join(pluginBasePath, folder);

			return this.registerPlugin(pluginPath, folder);
		});

		await Promise.allSettled(pluginPromises);
	}

	/**
	 * Mount the plugins.
	 */
	private async mountPlugins() {
		if (this.plugins.length === 0) {
			this.bot.getLogger().warn("No plugins discovered.");

			return;
		}

		const pluginPromises = this.plugins.map(plugin => {
			return plugin.mount()
				.then(() => plugin);
		});

		const results = await Promise.allSettled(pluginPromises);

		results.map(result => {
			if (result.status === "fulfilled") {
				this.bot.getLogger().info(`Plugin ${ result.value?.getName() } has been mounted.`);
			}
		});
	}

	/**
	 * Gets the discovered plugins.
	 */
	public getPlugins(): Plugin[] {
		return this.plugins;
	}
}
