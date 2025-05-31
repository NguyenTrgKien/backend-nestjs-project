import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  signIn(@Body() dataLogin: CreateAuthDto) {
    const { email, password } = dataLogin;
    return this.authService.signIn(email, password);
  }
}
