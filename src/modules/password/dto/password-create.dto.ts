import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PasswordCreateDTO {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	password: string;
}
