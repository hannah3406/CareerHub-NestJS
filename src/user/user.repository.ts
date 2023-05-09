import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, userDocument } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }
  async updateById(
    _id: string,
    type: string,
    value: string,
  ): Promise<UpdateWriteOpResult> {
    try {
      return await this.userModel.updateOne(
        { _id },
        { $set: { [type]: value } },
      );
    } catch (e) {
      console.log('사용자 업데이트에 실패했습니다', e.message);
      throw e;
    }
    // return await this.userModel.findOne({ email });
  }
  async findProfileByEmail(email: string): Promise<User | null> {
    return await this.userModel
      .findOne({ email })
      .select('-password')
      .select('-refreshToken');
  }
  async findReviewById(_id: string): Promise<User | null> {
    try {
      const result = await this.userModel.findOne({ _id }).select('review');
      // if (!result) {
      //   throw new BadRequestException({
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     message,
      //   });
      // }
      return result;
    } catch (e) {
      console.log(e, 'user 리뷰 조회 실패!');
    }
  }
  async updateReviewById(
    _id: string,
    boardId: string,
  ): Promise<UpdateWriteOpResult> {
    try {
      return this.userModel.updateOne(
        { _id },
        { $addToSet: { review: boardId } },
      );
    } catch (e) {
      console.log(e, 'user 리뷰 조회 실패!');
    }
  }
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return !!result;
  }
  async create(userData: CreateUserDto): Promise<User> {
    return await this.userModel.create({ ...userData, profileimg: 0 });
  }
  async updateRefreshToken(
    refreshToken: string,
    email: string,
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { email },
      { $set: { refreshToken } },
    );
  }
}
