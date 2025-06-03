import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy JWT từ header: Authorization: Bearer<token>
      ignoreExpiration: false, // JWT hết hạn sẽ không được chấp nhận
      secretOrKey: configService.get<string>('JWT_SECRET') as string, // Khóa bí mật để giải mã token
    });
  }

  // Khi token hợp lệ thì hàm này sẽ được gọi
  validate(payload: { sub: string; username: string }) {
    return { userId: payload.sub, username: payload.username };
  }
}
