import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PasswordDocument = Password & Document;

@Schema({
	versionKey: false,
	timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
})
export class Password {
	@Prop({ required: true })
	id: string;

	@Prop({ required: true })
	user: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	password: string;

	@Prop()
	createdAt: number;

	@Prop()
	updatedAt: number;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);
