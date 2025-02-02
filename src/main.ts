import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { expressMiddleware as prometheusMiddleware } from 'prometheus-api-metrics';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

const APP_NAME_PREFIX = 'app-name-prefix';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(
    prometheusMiddleware({
      additionalLabels: ['app'],
      extractAdditionalLabelValuesFn: () => ({ app: APP_NAME_PREFIX }),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Planify')
    .setDescription('The planify API description')
    .setVersion('1.0')
    .addTag('planify')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');

  await app.listen(port);
}
bootstrap();
