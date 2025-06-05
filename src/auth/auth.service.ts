import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/helpers/util';
import { UserService } from 'src/modules/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<unknown> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email không tồn tại!');
    }
    const isValidPassword = await comparePassword(password, user?.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Mật khẩu không đúng!');
    }
    return user;
  }

  async login(email: string): Promise<any> {
    console.log(email);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }
    const payload = { sub: user._id, username: user.email };
    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  handleRegister = (registerDto: CreateAuthDto) => {
    return this.userService.handleRegister(registerDto);
  };
}
