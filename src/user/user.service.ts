import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);

    if (user) {
      return user;
    }
    throw new HttpException(
      '존재하지 않는 이메일입니다! 회원가입 후 이용해주세요',
      HttpStatus.NOT_FOUND,
    );
  }
  async getProfile(email: string) {
    try {
      const result = await this.userRepository.findProfileByEmail(email);
      return result;
    } catch (e) {
      throw new HttpException('findProfileByEmail 찾기 실패', e.statusCode);
    }
  }
  async updateUser(_id: string, userData: UpdateUserDto) {
    const { type, value } = userData;
    try {
      const result = await this.userRepository.updateById(_id, type, value);
      return result;
    } catch (e) {
      throw new HttpException('updateById 실패', e.statusCode);
    }
  }
  async setRefreshToken(refreshToken: string, email: string) {
    try {
      await this.userRepository.updateRefreshToken(refreshToken, email);
    } catch (e) {
      throw new HttpException('updateRefreshToken 실패', e.statusCode);
    }
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userRepository.findUserByEmail(email);

    const isRefreshToken = refreshToken === user.refreshToken;

    if (isRefreshToken) {
      return user;
    }
  }
  async findReviewById(id: string, boardId: string) {
    // userModel 에서 id로 view 가져오기
    // const isView = await this.userRepository.isReviewById(id, boardId);
    const isView =
      (await this.userRepository.isReviewById(id, boardId)) !== null;

    if (isView) return null;
    try {
      // userModel 에서 id의 view 안에 boardId 추가
      return this.userRepository.updateReviewById(id, boardId);
    } catch (e) {
      throw new HttpException('updateReviewById 실패', e.statusCode);
    }
  }

  async getMyViewBoard(id: string) {
    const { view } = await this.userRepository.findReviewById(id);
    return view;
  }
}
