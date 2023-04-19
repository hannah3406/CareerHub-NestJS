import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebCrawling, WebCrawlingDocument } from './schema/web-crawling.schema';

@Injectable()
export class WebCrawlingService {
  constructor(
    @InjectModel(WebCrawling.name)
    private readonly webCrawlingModel: Model<WebCrawlingDocument>,
  ) {}

  async getList(queryString: {
    page?: number;
    keyword?: string;
    type?: string;
  }): Promise<{ total: number; results: WebCrawlingDocument[] }> {
    const { page, keyword, type } = queryString;
    const contentsType = [
      'description',
      'majorTasks',
      'experience',
      'preferential',
    ];
    const limit = 10;
    const skip = (page - 1) * limit;
    let filter = {};
    if (type === 'contents') {
      filter = contentsType.reduce(
        (acc, type) => {
          acc.$or.push({ [type]: { $regex: new RegExp(`${keyword}`, 'i') } });
          return acc;
        },
        { $or: [] },
      );
    }
    if (type !== 'contents' && type !== undefined) {
      filter = { [type]: { $regex: new RegExp(`${keyword}`, 'i') } };
    }
    const query = this.webCrawlingModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await this.webCrawlingModel.find(filter).count();
    const results = await query.exec();
    return { total, results };
  }
  async getListCount(queryString: {
    page?: number;
    keyword?: string;
    type?: string;
  }): Promise<number> {
    const { keyword, type } = queryString;
    const contentsType = [
      'description',
      'majorTasks',
      'experience',
      'preferential',
    ];
    let filter = {};
    if (type === 'contents') {
      filter = contentsType.reduce(
        (acc, type) => {
          acc.$or.push({ [type]: { $regex: new RegExp(`${keyword}`, 'i') } });
          return acc;
        },
        { $or: [] },
      );
    }
    if (type !== 'contents' && type !== undefined) {
      filter = { [type]: { $regex: new RegExp(`${keyword}`, 'i') } };
    }
    const total = await this.webCrawlingModel.find(filter).count();
    if (total === 0) return undefined;
    return total;
  }
}
