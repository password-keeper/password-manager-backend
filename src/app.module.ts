import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { RateLimiterModule, RateLimiterGuard } from "nestjs-rate-limiter";
import { AuthModule } from "@modules/auth/auth.module";
import { PasswordModule } from "@modules/password/password.module";
import { factory } from "./config";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		RateLimiterModule.register({
			points: 100,
			duration: 5,
			keyPrefix: "global",
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>("MONGODB.URL"),
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}),
			inject: [ConfigService],
		}),
		ConfigModule.forRoot({
			load: [factory],
		}),
		AuthModule,
		PasswordModule,
	],
	controllers: [AppController],
	providers: [{ provide: APP_GUARD, useClass: RateLimiterGuard }],
})
export class AppModule {}
