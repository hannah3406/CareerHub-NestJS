import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { UpdateBoardDto } from './dto/update-board';
import { Community } from './schema/community.schema';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @ApiOperation({ summary: '게시글목록' })
  @Get('/getList')
  async getList(@Query() query) {
    return this.communityService.getList(query);
  }
  @ApiOperation({ summary: '게시글id로 조회' })
  @Get('/:id')
  async getBoardById(@Param('id') _id: string) {
    return this.communityService.getBoardById(_id);
  }

  @ApiOperation({ summary: '게시글작성' })
  @Post('createBoard')
  async createBoard(@Body() community: Community): Promise<any> {
    return this.communityService.createBoard(community);
  }

  @ApiOperation({ summary: '게시글 업데이트' })
  @Patch('updateBoard/:id')
  async updateBoard(@Param('id') id: string, @Body() editData: UpdateBoardDto) {
    console.log(editData, 'editData');
    return this.communityService.updateBoard(id, editData);
  }
  @ApiOperation({ summary: '게시글 삭제' })
  @Delete('deleteBoard/:id')
  async deleteBoard(@Param('id') id: string) {
    return this.communityService.deleteBoard(id);
  }
}
