import { config } from "dotenv";

config();

const environment = process.env.APP_ENV;

export enum Environment {
	DEVELOP = "develop",
	PRODUCTION = "production"
}

export const isDevelop = environment === Environment.DEVELOP;
