import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/access.guard';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommunityService } from 'src/community/community.service';
interface reqUser extends Request {
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
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private readonly communityService: CommunityService,
  ) {}

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

  @ApiOperation({ summary: '회원가입' })
  @Post('create')
  async createUser(@Body() user: User): Promise<any> {
    return this.authService.createUser(user);
  }

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '작성한 게시글' })
  @Get('myArticle')
  getMyArticle(@Req() req: reqUser) {
    const { id } = req.user;

    return this.communityService.getMyArticle(id);
  }
}
