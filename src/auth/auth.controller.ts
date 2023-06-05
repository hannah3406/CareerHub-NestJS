import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from 'src/user/schema/user.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { LogoutRequestDto } from './dto/logout-request.dto copy';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from './guards/refresh.guard';

export interface reqUser extends Request {
  user: User;
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('create')
  async createUser(@Body() user: User): Promise<any> {
    return this.authService.createUser(user);
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() data: LoginRequestDto) {
    return this.authService.handleLogin(data);
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Body() data: LogoutRequestDto,
  ) {
    return await this.authService.logout(data);
  }

  @ApiOperation({ summary: '리프레시토큰' })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: reqUser) {
    const user = req.user;
    const { email, _id } = user;

    const payload = { email, _id: _id.toString() };
    return this.authService.refresh(payload);
  }
}
