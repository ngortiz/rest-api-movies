import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation (this is good practice when using DTOs!)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Set up Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Movies REST API')
    .setDescription('The Movies and Persons API description')
    .setVersion('1.0')
    .addBearerAuth() // This adds a login button in the UI for our AuthGuard!
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Set the path where the documentation will be available
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
