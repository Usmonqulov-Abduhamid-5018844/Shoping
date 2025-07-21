import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const Port = Number(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('Online Marketpleys')
    .setDescription('The cats API description')
    .setVersion('2.1')
    .addSecurityRequirements('bearer', ['bearer'])
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(Port, () => {
    console.log(`Server started on port ${Port}`);
  });
}
bootstrap();
