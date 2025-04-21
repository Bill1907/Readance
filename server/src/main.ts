import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // .env 파일에서 환경변수를 가져오기 위해 dotenv 설정이 필요합니다
  // NestJS는 기본적으로 ConfigModule을 사용하거나 dotenv를 직접 import해야 합니다
  const port = process.env.PORT || 8080;
  console.log(`Application is running on port: ${port}`);
  await app.listen(port);
}
bootstrap();
