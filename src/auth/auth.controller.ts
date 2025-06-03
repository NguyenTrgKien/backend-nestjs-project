import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

interface RequestWithUser extends Request {
  user: {
    email: string;
    [key: string]: any;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  @Public()
  login(@Request() req: RequestWithUser) {
    const { email } = req.user;
    return this.authService.login(email);
  }

  @Post('/register')
  @Public()
  registerUser(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('/send-email')
  @Public()
  senMail() {
    this.mailerService
      .sendMail({
        to: 'nguyentrungkien040921@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>Tôi đã gửi email thành công! HIHI.</b>', // HTML body content
      })
      .then(() => {})
      .catch(() => {});
    return 'Thành công!';
  }
}
