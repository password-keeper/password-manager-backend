import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "@models/user.schema";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { removeProperties } from "remove-properties";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization;

		const decoded = this.jwtService.verify(token);
		if (decoded && decoded.id) {
			let user = await this.userModel.findOne({ id: decoded.id });
			if (user) {
				request.user = {
					...removeProperties((user as any)._doc, [
						"password",
						"_id",
					]),
					token: token,
				} as PasswordManager.Jwt;
				return true;
			}
			return false;
		}
		return false;
	}
}
