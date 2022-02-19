import { Module } from "@nestjs/common";
import { AuthController } from "@modules/auth/auth.controller";
import { AuthService } from "@modules/auth/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "@models/user.schema";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Snowflake } from "@libs/snowflake";
import { Password, PasswordSchema } from "@models/password.schema";

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
	controllers: [AuthController],
	providers: [AuthService, Snowflake],
	exports: [AuthService],
})
export class AuthModule {}
