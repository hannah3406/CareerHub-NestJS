import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Touchscreen } from 'puppeteer';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment';
import { commentsDocument } from 'src/comments/schema/comments.schema';
import { CreateBoardDto } from './dto/create-board';
import { UpdateBoardDto } from './dto/update-board';
import { Community, communityDocument } from './schema/community.schema';
type DeleteResult = {
  acknowledged: boolean;
  deletedCount: number;
};
@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private readonly communityModel: Model<communityDocument>,
    private readonly commentsService: CommentsService,
  ) {}

  async createBoard(boardData: CreateBoardDto) {
    await this.communityModel.create({ ...boardData, like: 0, commentCnt: 0 });
  }

  async getList(queryString: {
    page?: number;
    keyword?: string;
    type?: string;
  }): Promise<{ total: number; results: communityDocument[] }> {
    const { page, keyword, type } = queryString;
    let filter = {};
    const limit = 10;
    const skip = (page - 1) * limit;
    if (type !== undefined) {
      filter = { [type]: { $regex: new RegExp(`${keyword}`, 'i') } };
    }
    if (type === 'userName') {
      filter = {
        'userInfo.userName': { $regex: new RegExp(`${keyword}`, 'i') },
      };
    }
    const query = this.communityModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.communityModel.countDocuments(filter);
    const results = await query.exec();
    return { total, results };
  }
  async getBoardById(_id: string): Promise<{
    boardDetail: communityDocument;
    boardComments: commentsDocument[];
  }> {
    const boardDetail = await this.getBoardDetailById(_id);
    const boardComments = await this.commentsService.getCommentById(_id);
    return { boardDetail, boardComments };
  }
  private async getBoardDetailById(_id: string): Promise<communityDocument> {
    const query = this.communityModel.findOne({ _id });
    const results = await query.exec();
    return results;
  }

  async deleteBoard(_id: string): Promise<DeleteResult> {
    try {
      const result = await this.communityModel.deleteOne({ _id });
      return result;
    } catch (e) {
      console.log(e, '게시글 삭제 오류 발생');
    }
  }
  async updateBoard(_id: string, editData: UpdateBoardDto) {
    try {
      return await this.communityModel.updateOne({ _id }, { $set: editData });
    } catch (e) {
      console.log('게시글 업데이트에 실패했습니다', e.message);
      throw e;
    }
  }

  async getMyBoard(userId: string): Promise<communityDocument[]> {
    try {
      const query = this.communityModel
        .find({
          'userInfo.userId': userId,
        })
        .select('_id')
        .select('title')
        .select('updatedAt')
        .sort({ createdAt: -1 });

      const result = await query.exec();
      return result;
    } catch (e) {
      console.log('게시물 찾기에 실패', e.message);
    }
  }
  async createComment(commentData: CreateCommentDto) {
    const { boardInfo } = commentData;
    const result = await this.commentsService.createComment(commentData);
    await this.updateCommentCount(boardInfo.boardId);
    return result;
  }
  async updateCommentCount(_id: string): Promise<any> {
    try {
      const community = await this.communityModel.findById(_id);
      community.commentCnt = community.commentCnt + 1;
      await community.save();
      return community;
    } catch (e) {
      console.log('댓글 카운팅 실패', e.message);
      throw e;
    }
  }
}
