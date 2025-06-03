import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', { exclude: [''] }); // thêm tiền tố vào api và ngoại trừ url chính
  app.useGlobalPipes(
    new ValidationPipe({
      // Giúp kiểm tra dữ liệu đầu vào từ các request, đảm bảo dữ liệu hợp lệ trước khi được xử lý bởi controller hoặc service
      whitelist: true, // Dùng để loại bỏ các thuộc tính không có trong DTO(neus client truyền lên dư thừa dữ liệu thì nó sẽ tự động loại bỏ dữ liệu thừa)
    }),
  );
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
