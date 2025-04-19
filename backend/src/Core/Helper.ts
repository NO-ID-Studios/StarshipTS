import { Logger } from "pino";

export default abstract class Helper {
	constructor(protected logger: Logger) {
		//
	}

	public abstract help(...args: unknown[]): Promise<unknown>;
}
