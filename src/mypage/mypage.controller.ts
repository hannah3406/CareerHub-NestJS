import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/access.guard';
import { CommentsService } from 'src/comments/comments.service';

import { CommunityService } from 'src/community/community.service';
import { reqUser } from 'src/user/user.controller';
@ApiTags('mypage')
@Controller('mypage')
export class MypageController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly commentsService: CommentsService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '작성한 게시글' })
  @Get('myBoard')
  getMyBoard(@Req() req: reqUser) {
    const { id } = req.user;
    return this.communityService.getMyBoard(id);
  }

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '작성한 댓글' })
  @Get('myComment')
  getMyComment(@Req() req: reqUser) {
    console.log('sss');
    const { id } = req.user;
    return this.commentsService.getMyComment(id);
  }
}
