import {
  // BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

interface User {
  isActive: boolean;
  username: string;
  password: string;
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email', // Mặc định là username
    });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = (await this.authService.validateUser(
      username,
      password,
    )) as User;
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Email/Mật khẩu không hợp lệ!');
    }
    // if (user.isActive === false) {
    //   throw new BadRequestException('Tài khoản chưa được kích hoạt!');
    // }
    return user;
  }
}
