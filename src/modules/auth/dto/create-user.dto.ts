import {
	IsEmail,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
	@ApiProperty()
	@Length(3)
	@IsString()
	name: string;

	@ApiProperty()
	@Length(3)
	@IsString()
	lastname: string;

	@ApiProperty()
	@Length(8, 32)
	@IsString()
	password: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsPhoneNumber()
	@IsOptional()
	phone: string;
}
