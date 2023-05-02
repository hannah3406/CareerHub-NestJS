import { Injectable } from '@nestjs/common';
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
    private readonly communityService: CommunityService,
  ) {}

  async saveRecommendBoards() {
    const commentCnt = await this.communityService.sortCommentCntBoard();
    const like = await this.communityService.sortLikeBoard();

    const likeSort = like.map((el, idx) => ({
      id: el._id,
      score: 5 - idx,
    }));

    const commentCntSort = commentCnt.map((el, idx) => ({
      id: el._id,
      score: 5 - idx,
    }));

    const merged = [...likeSort, ...commentCntSort];
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

    const communities = await this.communityService.findRecommendBoard(
      recommendBoardsId.list,
    );
    const result = communities.sort((a, b) => b.score - a.score);
    return result;
  }
  @Cron(CronExpression.EVERY_WEEK)
  async saveRecommendEveryDays() {
    await this.saveRecommendBoards();
  }
}