import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/access.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export interface reqUser extends Request {
  user: {
    email: string;
    id: string;
    iat: number;
    exp: number;
  };
}

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '프로필' })
  @Get('profile')
  profile(@Req() req: reqUser) {
    return this.userService.getProfile(req.user.email);
  }

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '프로필 업데이트' })
  @Patch('profile/:id')
  async updatetUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }
}
