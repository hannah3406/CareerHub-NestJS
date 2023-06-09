import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCommentDto } from './dto/create-comment';
import { Comments, commentsDocument } from './schema/comments.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private readonly commentsModel: Model<commentsDocument>,
  ) {}
  async createComment(commentData: CreateCommentDto) {
    try {
      return this.commentsModel.create({ ...commentData });
    } catch (e) {
      throw new HttpException('댓글 생성에 실패', e.statusCode);
    }
  }
  async getMyComment(userId: string): Promise<commentsDocument[]> {
    try {
      const query = this.commentsModel
        .find({
          'userInfo.userId': userId,
        })
        .select('contents')
        .select('boardInfo')
        .select('updatedAt')
        .sort({ createdAt: -1 });

      const result = await query.exec();
      return result;
    } catch (e) {
      throw new HttpException('내 댓글 찾기에 실패', e.statusCode);
    }
  }
  async getCommentById(boardId: string): Promise<commentsDocument[]> {
    try {
      const result = await this.commentsModel
        .find({
          'boardInfo.boardId': boardId,
        })
        .sort({ updatedAt: -1 });
      return result;
    } catch (e) {
      throw new HttpException(
        '게시글 댓글 리스트 조회 실패했습니다',
        e.statusCode,
      );
    }
  }
}
