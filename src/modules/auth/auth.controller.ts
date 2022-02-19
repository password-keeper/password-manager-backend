import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	Req,
	Patch,
	Delete,
} from "@nestjs/common";
import { AuthGuard } from "@guards/auth.guard";
import { AuthService } from "@modules/auth/auth.service";
import { CreateUserDTO } from "@modules/auth/dto/create-user.dto";
import { LoginDTO } from "@modules/auth/dto/login.dto";
import { PatchUserDTO } from "@modules/auth/dto/patch-user.dto";
import { PasswordDTO } from "@modules/auth/dto/password.dto";
import { User } from "src/decorators/user.decorator";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/new")
	create(
		@Body() user: CreateUserDTO,
	): Promise<PasswordManager.ReturnType<string>> {
		return this.authService.createNewUser(user);
	}

	@Get("/@me")
	@UseGuards(AuthGuard)
	getUser(
		@User() user: PasswordManager.Jwt,
	): Promise<PasswordManager.ReturnType<PasswordManager.User>> {
		return this.authService.getUser(user);
	}

	@Post("/login")
	login(
		@Body() field: LoginDTO,
	): Promise<PasswordManager.ReturnType<string>> {
		return this.authService.login(field);
	}

	@Delete("/@me")
	@UseGuards(AuthGuard)
	myAccountDelete(
		@User() user: PasswordManager.Jwt,
	): Promise<PasswordManager.ReturnType<boolean>> {
		return this.authService.accountDelete(user);
	}

	@Patch("/@me")
	@UseGuards(AuthGuard)
	updateMy(
		@User() user: PasswordManager.Jwt,
		@Body() patchUserDTO: PatchUserDTO,
	): Promise<PasswordManager.ReturnType<PasswordManager.User>> {
		return this.authService.updateMy(user, patchUserDTO);
	}

	@Patch("/password")
	@UseGuards(AuthGuard)
	updateMyPassword(
		@User() user: PasswordManager.Jwt,
		@Body() password: PasswordDTO,
	): Promise<PasswordManager.ReturnType<string>> {
		return this.authService.updatePassword(user, password);
	}
}
