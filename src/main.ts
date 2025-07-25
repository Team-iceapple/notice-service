import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
