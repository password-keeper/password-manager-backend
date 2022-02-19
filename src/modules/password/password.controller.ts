import {
	Controller,
	Get,
	Req,
	UseGuards,
	Post,
	Body,
	Param,
	Patch,
	Delete,
} from "@nestjs/common";
import { AuthGuard } from "@guards/auth.guard";
import { PasswordCreateDTO } from "@modules/password/dto/password-create.dto";
import { PasswordService } from "@modules/password/password.service";
import { User } from "src/decorators/user.decorator";

@Controller("password")
export class PasswordController {
	constructor(private readonly passwordService: PasswordService) {}

	@Get("/all")
	@UseGuards(AuthGuard)
	getAllPassword(
		@User() user: PasswordManager.Jwt,
	): Promise<PasswordManager.ReturnType<PasswordManager.Password[]>> {
		return this.passwordService.getAll(user);
	}

	@Get(":id")
	@UseGuards(AuthGuard)
	getByIdAndPassword(
		@User() user: PasswordManager.Jwt,
		@Param("id") id: string,
	): Promise<PasswordManager.ReturnType<PasswordManager.Password>> {
		return this.passwordService.getById(user, id);
	}

	@Post()
	@UseGuards(AuthGuard)
	createPassword(
		@User() user: PasswordManager.Jwt,
		@Body() field: PasswordCreateDTO,
	): Promise<PasswordManager.ReturnType<boolean>> {
		return this.passwordService.createPassword(user, field);
	}

	@Patch(":id")
	@UseGuards(AuthGuard)
	updatePassword(
		@User() user: PasswordManager.Jwt,
		@Body() field: PasswordCreateDTO,
		@Param("id") id,
	): Promise<PasswordManager.ReturnType<PasswordManager.Password>> {
		return this.passwordService.updatePassword(user, field, id);
	}

	@Delete(":id")
	@UseGuards(AuthGuard)
	deletePassword(
		@User() user: PasswordManager.Jwt,
		@Param("id") id: string,
	): Promise<PasswordManager.ReturnType<boolean>> {
		return this.passwordService.deletePassword(user, id);
	}
}
