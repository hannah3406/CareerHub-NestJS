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
    console.log(boardData, '========');
    await this.communityModel.create({ ...boardData, like: 0 });
  }

  async getList(queryString: {
    page?: number;
    keyword?: string;
    type?: string;
  }): Promise<communityDocument[]> {
    const { page, keyword, type } = queryString;

    const limit = 10;
    const skip = (page - 1) * limit;
    const query = this.communityModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const result = await query.exec();
    return result;
  }
}
