export default class Configurable<ConfigType = object> {
	protected config: ConfigType;

	/**
	 * Gets the configuration object.
	 */
	public getConfig() {
		return this.config;
	}
}
