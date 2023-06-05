import {
  ExecutionContext,
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }
    const token = authorization.replace('Bearer ', '');
    request.user = this.validateToken(token);
    return true;
  }
  validateToken(token: string) {
    const secretKey = process.env.REFRESH_TOKEN;
    try {
      const decoded = this.jwtService.verify(token, { secret: secretKey });
      this.userService.getByEmail(decoded['email']);

      return decoded;
    } catch (e) {
      switch (e.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'INVALID_TOKEN':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
          throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        case 'jwt expired':
          console.log(e.message);
          throw new GoneException('토큰이 만료되었습니다.');
        default:
          console.log(e.message);
          throw new InternalServerErrorException(
            e.message + ':' + '서버 오류입니다.',
          );
      }
    }
  }
}
