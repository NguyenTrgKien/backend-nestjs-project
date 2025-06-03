import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super(); // Khai báo super để gọi constructor của lớp cha
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context); // Để passport thực hiện xác thực JWT, tức là nó sẽ gọi cho JwtStrategy
  }

  // Hàm này được gọi sau khi JWT được xác thực
  handleRequest<TUser = any>(
    err: any,
    user: any, // Đối tượng user được trả về từ hàm validate của jwtStrategy
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    console.log(info, context, status);
    if (err || !user) {
      throw err || new UnauthorizedException('AccessToken không hợp lệ!');
    }
    return user as TUser;
  }
}
