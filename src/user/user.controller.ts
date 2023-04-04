import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/access.guard';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
interface reqUser extends Request {
  user: User;
}
@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '프로필' })
  @Get('profile')
  profile(@Req() req: reqUser) {
    console.log(req.user, 'req.user');
    return this.userService.getProfile(req.user.email);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post('create')
  async createUser(@Body() user: User): Promise<any> {
    return this.authService.createUser(user);
  }
}
