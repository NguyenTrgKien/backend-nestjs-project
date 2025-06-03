import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LikesModule } from './modules/likes/likes.module';
import { MenuItemModule } from './modules/menu.item/menu.item.module';
import { MenuItemOptionsModule } from './modules/menu.item.options/menu.item.options.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderDetailModule } from './modules/order.detail/order.detail.module';
import { OrderModule } from './modules/order/order.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }), // Cho phép truy cập biến môi trường
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      // forRootAsync giúp câu hình các biến mối trường
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'), // Địa chỉ smtp server
          port: config.get<string>('MAIL_PORT'), // Cổng smtp thường là cổng 465 cho secure: true, 587 cho secure: false
          secure: true,
          auth: {
            user: config.get<string>('MAIL_USER'), // Email của mình
            pass: config.get<string>('MAIL_PASS'), // Mật khẩu
          },
        },
        defaults: {
          from: `NESTJS-LEARN <${config.get<string>('MAIL_USER')}>`,
        },
        template: {
          dir: __dirname + '/email/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    LikesModule,
    MenuItemModule,
    MenuItemOptionsModule,
    MenuModule,
    OrderDetailModule,
    OrderModule,
    RestaurantsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Đoạn này dùng để đăng kí guard cho toàn bộ các route trong ứng dụng
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
