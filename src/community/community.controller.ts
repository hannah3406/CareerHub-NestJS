import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { Community } from './schema/community.schema';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @ApiOperation({ summary: '게시글목록' })
  @Get('/getList')
  async getList(@Query() query) {
    return this.communityService.getList(query);
  }

  @ApiOperation({ summary: '게시글작성' })
  @Post('createBoard')
  async createBoard(@Body() community: Community): Promise<any> {
    return this.communityService.createBoard(community);
  }
}
