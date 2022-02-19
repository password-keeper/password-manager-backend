import { HttpStatus } from "@nestjs/common";

export {};

declare global {
	namespace PasswordManager {
		interface User {
			name: string;
			lastname: string;
			email: string;
			phone?: string;
			id: string;
		}

		interface Password {
			id: string;
			name: string;
			password: string;
			createdAt: number;
			updatedAt: number;
		}

		interface Token {
			access_token: string;
			refresh_token?: string;
		}

		interface Jwt extends User {
			token: string;
		}

		interface ReturnType<T> {
			statusCode: HttpStatus;
			message: string;
			data: T;
		}
	}
}
