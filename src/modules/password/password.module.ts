import { Password, PasswordSchema } from "@models/password.schema";
import { User, UserSchema } from "@models/user.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PasswordController } from "@modules/password/password.controller";
import { PasswordService } from "@modules/password/password.service";
import { Snowflake } from "@libs/snowflake";
import { Crypto } from "@libs/crypto";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET"),
			}),
			inject: [ConfigService],
		}),
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Password.name, schema: PasswordSchema },
		]),
	],
	controllers: [PasswordController],
	providers: [PasswordService, Snowflake, Crypto],
	exports: [PasswordService],
})
export class PasswordModule {}
