import cors from "cors";
import morgan from "morgan";
import { Logger } from "pino";
import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import Environment from "@/Core/Environment";
import { isDevelop } from "@/System/Environment";

export default class WebServerService {
	private app: Express;

	constructor (private logger: Logger) {
		this.app = express();
	}

	public start() {
		const { webHost, webPort } = Environment;

		this.app.use(bodyParser.json());
		this.app.use(morgan("combined"));
		this.app.use(cors());

		// In develop this is not needed since we will use the development server from Vite to serve
		// frontend content.
		if (!isDevelop) {
			this.app.get("/", (request: Request, response: Response) => {
				response.status(200).send();
			});
		}

		this.app.listen(webPort, webHost, () => {
			this.logger.info(`Web Server is listening on ${ webHost }:${ webPort }.`);
		});
	}

	public getWebServer() {
		return this.app;
	}
}
