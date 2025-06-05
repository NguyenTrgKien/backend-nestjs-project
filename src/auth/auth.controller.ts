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
    console.log(req.user);
    const { email } = req.user;
    return this.authService.login(email);
  }

  @Post('/register')
  @Public()
  registerUser(@Body() registerDto: CreateAuthDto) {
    console.log(registerDto);
    return this.authService.handleRegister(registerDto);
  }

  @Post('/send-email')
  @Public()
  senMail() {
    this.mailerService
      .sendMail({
        to: 'trungkien040921@gmail.com', // list of receivers
        subject: 'Thông báo khoản vay của bạn đã được duyệt ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register', // Tên template dùng để render nội dung email
        context: {
          // Các biến sẽ truyền vào template
          name: 'Quốc Thái',
          amount: '35.000.000đ',
          term: '3',
          disbursementDate: '18/7/2025',
          repaymentMethod: 'Tiền mặt',
        },
      })
      .then(() => {})
      .catch(() => {});
    return 'Gửi thành công! HaHa';
  }
}
