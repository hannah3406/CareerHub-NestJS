import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateWriteOpResult } from 'mongoose';
import { JwtAccessGuard } from 'src/auth/guards/access.guard';

import { Comments } from 'src/comments/schema/comments.schema';
import { reqUser } from 'src/user/user.controller';
import { CommunityService } from './community.service';
import { UpdateBoardDto } from './dto/update-board';
import { Community } from './schema/community.schema';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '게시글목록' })
  @Get('/getList')
  async getList(@Query() query) {
    return this.communityService.getList(query);
  }
  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '게시글id로 조회' })
  @Get('/:id')
  async getBoardById(@Param('id') _id: string) {
    return this.communityService.getBoardById(_id);
  }

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '게시글작성' })
  @Post('createBoard')
  async createBoard(@Body() community: Community): Promise<any> {
    return this.communityService.createBoard(community);
  }

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '조회수' })
  @Post('viewCount/:boardId')
  async viewCount(
    @Req() req: reqUser,
    @Param('boardId') boardId: string,
  ): Promise<any> {
    const { id } = req.user;
    return this.communityService.viewCount(id, boardId);
  }

  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '좋아요' })
  @Post('like')
  async boardLike(
    @Req() req: reqUser,
    @Body() boardId: string,
  ): Promise<{ result: UpdateWriteOpResult; isLikeState: boolean }> {
    const { id } = req.user;
    return this.communityService.boardLike(id, boardId);
  }

  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '게시글 업데이트' })
  @Patch('updateBoard/:id')
  async updateBoard(@Param('id') id: string, @Body() editData: UpdateBoardDto) {
    return this.communityService.updateBoard(id, editData);
  }
  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '게시글 삭제' })
  @Delete('deleteBoard/:id')
  async deleteBoard(@Param('id') id: string) {
    return this.communityService.deleteBoard(id);
  }
  @UseGuards(JwtAccessGuard)
  @ApiOperation({ summary: '댓글작성' })
  @Post('/comments/create')
  async createComment(@Body() comment: Comments): Promise<any> {
    return this.communityService.createComment(comment);
  }
}
