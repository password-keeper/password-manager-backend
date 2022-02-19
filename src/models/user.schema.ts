import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({
	versionKey: false,
	timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
})
export class User {
	@Prop({ required: true })
	id: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	lastname: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	email: string;

	@Prop()
	phone: string;

	@Prop()
	createdAt: number;

	@Prop()
	updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
