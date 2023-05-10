import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { CommunityService } from 'src/community/community.service';
import {
  RecommendBoard,
  RecommendBoardDocument,
} from './schema/recommend-board.schema';

@Injectable()
export class RecommendBoardService {
  constructor(
    @InjectModel(RecommendBoard.name)
    private readonly recommendBoardModel: Model<RecommendBoardDocument>,
    @Inject(forwardRef(() => CommunityService))
    private readonly communityService: CommunityService,
  ) {}

  async saveRecommendBoards() {
    const commentCnt = await this.communityService.sortByKeyBoard('commentCnt');
    const like = await this.communityService.sortByKeyBoard('like');
    const view = await this.communityService.sortByKeyBoard('view');

    const likeSort = this.sortObject(like);
    const commentCntSort = this.sortObject(commentCnt);
    const viewCntSort = this.sortObject(view);

    const merged = [...likeSort, ...commentCntSort, ...viewCntSort];
    const rankMap = merged.reduce((acc, cur) => {
      const { id, score } = cur;
      acc[id] = acc[id] ? acc[id] + score : score;
      return acc;
    }, {});
    const rank = Object.keys(rankMap).map((id) => ({ id, score: rankMap[id] }));
    const top5 = rank.sort((a, b) => b.score - a.score).slice(0, 5);

    await this.recommendBoardModel.create({ list: top5 });
  }

  async getRecommendBoards() {
    const recommendBoardsId = await this.recommendBoardModel
      .findOne()
      .sort({ _id: -1 })
      .select('list');
    const ids = recommendBoardsId.list.map((list) => list.id);
    const boardList = await this.communityService.findRecommendBoard(ids);
    const recommendBoard = recommendBoardsId.list.map(({ id, score }) => {
      const board = boardList.find((item) => item.id === id);
      return { ...board.toJSON(), score };
    });
    const result = recommendBoard.sort((a, b) => b.score - a.score);
    return result;
  }
  @Cron(CronExpression.EVERY_WEEK)
  async saveRecommendEveryDays() {
    await this.saveRecommendBoards();
  }
  sortObject(result: any[]) {
    return result.map((el, idx) => ({
      id: el._id,
      score: 5 - idx,
    }));
  }
}
