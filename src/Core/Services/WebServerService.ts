import cors from "cors";
import morgan from "morgan";
import { Logger } from "pino";
import bodyParser from "body-parser";
import express, { Express } from "express";

export default class WebServerService {
	private app: Express;

	constructor (private logger: Logger) {
		this.app = express();
	}

	public start() {
		const { HOST, PORT } = process.env;

		this.app.use(bodyParser.json());
		this.app.use(morgan("combined"));
		this.app.use(cors())

		this.app.listen(+PORT, HOST, () => {
			this.logger.info(`Web Server is listening on ${ HOST }:${ PORT }.`);
		});
	}

	public getWebServer() {
		return this.app;
	}
}
