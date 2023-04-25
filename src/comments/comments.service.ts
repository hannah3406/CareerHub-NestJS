import { Injectable } from '@nestjs/common';
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
    await this.commentsModel.create({ ...commentData });
  }
}
