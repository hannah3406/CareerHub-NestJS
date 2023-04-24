import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './dto/create-board';
import { Community, communityDocument } from './schema/community.schema';

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
}
