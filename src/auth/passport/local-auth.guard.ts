import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Khi được gọi nó sẽ gọi đến file passport để xác thực người dùng
export class LocalAuthGuard extends AuthGuard('local') {}
