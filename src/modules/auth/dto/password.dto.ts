import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PasswordDTO {
	@ApiProperty()
	@IsString()
	@Length(8, 32)
	oldPassword: string;

	@ApiProperty()
	@IsString()
	@Length(8, 32)
	newPassword: string;

	@ApiProperty()
	@IsString()
	@Length(8, 32)
	newPassword2: string;
}
