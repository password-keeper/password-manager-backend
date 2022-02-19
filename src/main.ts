import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CONFIG } from "./config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix(CONFIG.API_VERSION);

	const config = new DocumentBuilder()
		.setTitle("Password Manager")
		.setDescription("")
		.setVersion("1.0")
		.addTag("cats")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(3000);
}
bootstrap();
