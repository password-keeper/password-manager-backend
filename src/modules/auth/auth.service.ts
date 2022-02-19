import {
	ConflictException,
	HttpStatus,
	Injectable,
	NotAcceptableException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { User, UserDocument } from "@models/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDTO } from "@modules/auth/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { PasswordDTO } from "@modules/auth/dto/password.dto";
import { PatchUserDTO } from "@modules/auth/dto/patch-user.dto";
import { LoginDTO } from "@modules/auth/dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { Snowflake } from "@libs/snowflake";
import { Password, PasswordDocument } from "@models/password.schema";
import { Model } from "mongoose";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
		@InjectModel(Password.name)
		private readonly passwordModel: Model<PasswordDocument>,
		private readonly jwtService: JwtService,
		private readonly snowflake: Snowflake,
	) {}

	async createNewUser({
		email,
		lastname,
		name,
		password,
		phone,
	}: CreateUserDTO): Promise<PasswordManager.ReturnType<string>> {
		const isExists = await this.userModel.exists({ email });
		if (isExists)
			throw new ConflictException(
				"This email address is already registered",
			);
		const id = this.snowflake.generate();
		const model = new this.userModel({
			email,
			lastname,
			name,
			password,
			phone,
			id,
		});

		model.password = await bcrypt.hash(model.password, 10);
		await model.save();
		const token = this.createUserToken(id);

		return {
			statusCode: HttpStatus.CREATED,
			message: "Signed up.",
			data: token,
		};
	}

	async login({
		email,
		password,
	}: LoginDTO): Promise<PasswordManager.ReturnType<string>> {
		const user = await this.userModel.findOne({ email });
		if (!user) throw new NotFoundException("Not found user.");
		const match = await bcrypt.compare(password, user.password);
		if (!match) throw new UnauthorizedException("Password doesn't matches");

		const token = this.createUserToken(user.id);

		return {
			statusCode: HttpStatus.OK,
			message: "Logged in successfully",
			data: token,
		};
	}

	async getUser(
		user: PasswordManager.Jwt,
	): Promise<PasswordManager.ReturnType<PasswordManager.User>> {
		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: user,
		};
	}

	async updatePassword(
		user: PasswordManager.Jwt,
		password: PasswordDTO,
	): Promise<PasswordManager.ReturnType<string>> {
		const getUser = await this.userModel.findOne({ id: user.id });
		if (!getUser) throw new NotFoundException("User not found");

		if (password.newPassword !== password.newPassword2)
			throw new NotAcceptableException(
				"new password and new password2 do not match",
			);

		const match = await bcrypt.compare(
			password.oldPassword,
			getUser.password,
		);
		if (!match)
			throw new UnauthorizedException("Old password doesn't matches");

		const newPassword = await bcrypt.hash(password.newPassword, 10);
		getUser.password = newPassword;

		await getUser.save();

		const token = this.createUserToken(user.id);

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: token,
		};
	}

	async updateMy(
		user: PasswordManager.Jwt,
		newUser: PatchUserDTO,
	): Promise<PasswordManager.ReturnType<PasswordManager.User>> {
		const getUser = await this.userModel.findOne({ id: user.id });
		if (!getUser) throw new NotFoundException("User not found");

		getUser.name =
			!!newUser.name && newUser.name != getUser.name
				? newUser.name
				: getUser.name;
		getUser.email =
			!!newUser.email && newUser.email != getUser.email
				? newUser.email
				: getUser.email;
		getUser.lastname =
			!!newUser.lastname && newUser.lastname != getUser.lastname
				? newUser.lastname
				: getUser.lastname;
		getUser.phone =
			!!newUser.phone && newUser.phone != getUser.phone
				? newUser.phone
				: getUser.phone;

		await getUser.save();

		return {
			statusCode: 201,
			message: "successful",
			data: getUser,
		};
	}

	async accountDelete(
		user: PasswordManager.Jwt,
	): Promise<PasswordManager.ReturnType<boolean>> {
		const getUser = await this.userModel.findOne({ id: user.id });
		if (!getUser) throw new NotFoundException("User not found.");

		await this.userModel.deleteOne({ id: user.id });
		await this.passwordModel.deleteMany({ user: user.id });

		return {
			statusCode: HttpStatus.OK,
			message: "Account deleted",
			data: true,
		};
	}

	createUserToken(id: string): string {
		const token = this.jwtService.sign(
			{ id },
			{
				expiresIn: 1000 * 60 * 60 * 24 * 365,
			},
		);
		return token;
	}
}
