import { Injectable, NotFoundException } from '@nestjs/common';
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
    const isValidPassword = comparePassword(password, user?.password as string);
    if (!user || !isValidPassword) {
      return null;
    }
    return user;
  }

  async login(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    const payload = { sub: user._id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  handleRegister = (registerDto: CreateAuthDto) => {
    return this.userService.handleRegister(registerDto);
  };
}
