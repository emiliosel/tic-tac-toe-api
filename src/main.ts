import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Tic Tac Toe API')
    .setDescription('The Tic Tac Toe API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.config.PORT || 3000;
  await app.listen(port).then(() => {
    Logger.verbose(`Application running on http://localhost:${port}`);
    Logger.verbose(`Swagger documentation: http://localhost:${port}/api`);
  });
}
bootstrap();
