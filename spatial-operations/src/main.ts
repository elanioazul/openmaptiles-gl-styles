import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Strip away properties that don't have decorators
    forbidNonWhitelisted: true,    // Throw an error if extra properties are sent
    transform: true,               // Automatically transform payloads to DTO instances
  }));
  const config = new DocumentBuilder()
    .setTitle('helios-spatial-operations')
    .setDescription(
      `
      API for geodata management and spatial queries
      `,
    )
    .setVersion('1.0')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     description: 'Enter JWT token as: Bearer <token>',
    //   },
    //   'jwt-auth', // This name will be used to refer to the auth in @ç()
    // )
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup(`api`, app, document);
  app.enableCors();
  await app.listen(process.env.NEST_PORT ?? 5000);
  //docker ps --format "table {{.Names}}\t{{.Ports}}"
  //docker exec helios_gl_styles-nests netstat -an | grep LISTEN
  console.log(`
    Server is listening on: http://0.0.0.0:${process.env.NEST_PORT}. 
    Check in docker compose file for mapped port in host machine`
  );
}
await bootstrap();
