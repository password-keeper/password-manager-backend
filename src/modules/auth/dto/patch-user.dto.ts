import { IsEmail, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PatchUserDTO {
	@ApiProperty()
	@Length(3)
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty()
	@Length(3)
	@IsString()
	@IsOptional()
	lastname: string;

	@ApiProperty()
	@IsEmail()
	@IsOptional()
	email: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	phone: string;
}
