import EnvironmentConfig from "@/Core/Environment";

const environment = EnvironmentConfig.environment;

export enum Environment {
	DEVELOP = "develop",
	PRODUCTION = "production"
}

export const isDevelop = environment === Environment.DEVELOP;
