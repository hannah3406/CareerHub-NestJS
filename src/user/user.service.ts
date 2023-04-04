import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    } catch (e) {}
  }
  async setRefreshToken(refreshToken: string, email: string) {
    try {
      await this.userRepository.updateRefreshToken(refreshToken, email);
    } catch (e) {}
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userRepository.findUserByEmail(email);

    const isRefreshToken = refreshToken === user.refreshToken;

    if (isRefreshToken) {
      return user;
    }
  }
}
