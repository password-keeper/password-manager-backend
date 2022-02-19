import * as dotenv from "dotenv";

dotenv.config();

export const factory = () => ({
	API_VERSION: (process.env.API_VERSION as string) || "v1",
	JWT_SECRET: process.env.JWT_SECRET as string,
	MONGODB: {
		URL: process.env.MONGODB_URI,
	},
});

export const CONFIG = factory();
