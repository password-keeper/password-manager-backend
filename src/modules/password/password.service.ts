import {
	BadRequestException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "@models/user.schema";
import { Password, PasswordDocument } from "@models/password.schema";
import { PasswordCreateDTO } from "./dto/password-create.dto";
import { Crypto } from "@libs/crypto";
import { Snowflake } from "@libs/snowflake";

@Injectable()
export class PasswordService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
		@InjectModel(Password.name)
		private readonly passwordModel: Model<PasswordDocument>,
		private readonly crypto: Crypto,
		private readonly snowflake: Snowflake,
	) {}

	async getAll(
		user: PasswordManager.Jwt,
	): Promise<PasswordManager.ReturnType<PasswordManager.Password[]>> {
		const allPassword = await this.passwordModel.find({ user: user.id });
		if (!allPassword.length) throw new NotFoundException();

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: allPassword.map((pass) => {
				return {
					id: pass.id,
					name: pass.name,
					password: this.crypto.decrypt(pass.password),
					createdAt: pass.createdAt,
					updatedAt: pass.updatedAt,
				};
			}),
		};
	}

	async getById(
		user: PasswordManager.Jwt,
		id: string,
	): Promise<PasswordManager.ReturnType<PasswordManager.Password>> {
		const password = await this.passwordModel.findOne({
			user: user.id,
			id,
		});
		if (!password) throw new NotFoundException("password not found");

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: {
				id: password.id,
				name: password.name,
				password: this.crypto.decrypt(password.password),
				createdAt: password.createdAt,
				updatedAt: password.updatedAt,
			},
		};
	}

	async createPassword(
		user: PasswordManager.Jwt,
		field: PasswordCreateDTO,
	): Promise<PasswordManager.ReturnType<boolean>> {
		const getUser = await this.userModel.findOne({ id: user.id });
		if (!getUser) throw new NotFoundException("user not found");

		const id = this.snowflake.generate();
		const password = new this.passwordModel({
			id,
			user: user.id,
			name: field.name,
			password: this.crypto.encrypt(field.password),
		});
		await password.save();

		return {
			statusCode: HttpStatus.CREATED,
			message: "successful",
			data: true,
		};
	}

	async updatePassword(
		user: PasswordManager.Jwt,
		field: PasswordCreateDTO,
		id: string,
	): Promise<PasswordManager.ReturnType<PasswordManager.Password>> {
		const getUser = await this.userModel.findOne({ id: user.id });
		if (!getUser) throw new NotFoundException("user not found");

		const getPassword = await this.passwordModel.findOne({
			user: user.id,
			id,
		});
		if (!getPassword) throw new NotFoundException("password not found");

		getPassword.name =
			!!field.name && field.name != getPassword.name
				? field.name
				: getPassword.name;
		getPassword.password = this.crypto.encrypt(field.password);

		await getPassword.save();

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: {
				id: getPassword.id,
				createdAt: getPassword.createdAt,
				updatedAt: getPassword.updatedAt,
				name: getPassword.name,
				password: this.crypto.decrypt(getPassword.password),
			},
		};
	}

	async deletePassword(
		user: PasswordManager.Jwt,
		id: string,
	): Promise<PasswordManager.ReturnType<boolean>> {
		const getUser = await this.userModel.findOne({ id: user.id });
		if (!getUser) throw new NotFoundException("user not found");

		const getPassword = await this.passwordModel.findOne({
			user: user.id,
			id,
		});
		if (!getPassword) throw new NotFoundException("password not found");

		await getPassword.delete();

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: true,
		};
	}
}
