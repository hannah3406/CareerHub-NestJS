import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  ) {}

  async createBoard(boardData: CreateBoardDto) {
    await this.communityModel.create({ ...boardData, like: 0 });
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
  async getBoardById(_id: string): Promise<communityDocument[]> {
    const query = this.communityModel.find({ _id });
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
  async getMyArticle(userId: string): Promise<communityDocument[]> {
    try {
      const query = this.communityModel.find({
        'userInfo.userId': userId,
      });

      const result = await query
        .select('_id')
        .select('title')
        .select('updatedAt')
        .sort({ updatedAt: -1 })
        .exec();
      return result;
    } catch (e) {
      console.log('게시물 찾기에 실패', e.message);
    }
  }
}
