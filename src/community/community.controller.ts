import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/access.guard';
import { CommunityService } from './community.service';
import { UpdateBoardDto } from './dto/update-board';
import { Community } from './schema/community.schema';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(JwtAccessGuard)
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
}
