import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpException, UnauthorizedException } from '@nestjs/common';

@Catch(HttpException, UnauthorizedException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        response.status(status).json({ message: '유효하지 않은 토큰입니다.' });
        break;
      case HttpStatus.GONE:
        response.status(status).json({ message: '토큰이 만료되었습니다.' });
        break;
      case HttpStatus.NOT_FOUND:
        response
          .status(status)
          .json({ message: '요청한 자원을 찾을 수 없음.' });
        break;
      case HttpStatus.BAD_REQUEST:
        response.status(status).json({ message: '잘못된 요청입니다.' });
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        response.status(status).json({ message: '서버 오류입니다.' });
        break;
    }
  }
}
