import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecommendBoardService } from './recommend-board.service';
@ApiTags('RecommendBoard')
@Controller('recommend-board')
export class RecommendBoardController {
  constructor(private readonly recommendBoardService: RecommendBoardService) {}

  @ApiOperation({ summary: 'test' })
  @Get('test')
  async test() {
    return this.recommendBoardService.saveRecommendBoards();
  }

  @ApiOperation({ summary: '추천게시글' })
  @Get('')
  async getRecommendBoards() {
    return this.recommendBoardService.getRecommendBoards();
  }
}
