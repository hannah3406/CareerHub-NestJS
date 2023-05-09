import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from '../constants';
import { LoginRequestDto } from './dto/login-request.dto';
import { LogoutRequestDto } from './dto/logout-request.dto copy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new UnauthorizedException('계정이 없습니다');
    }
  }
  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordVaildated: boolean = await bcrypt.compare(
      password,
      hashedPassword,
    );
    if (!isPasswordVaildated) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
  }
  async createUser(userData: CreateUserDto) {
    const { email, name, password } = userData;
    const isUserExist = await this.userRepository.existsByEmail(email);

    if (isUserExist) {
      throw new UnauthorizedException('이미 가입된 이메일 계정입니다!!!!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.userRepository.create({
        email,
        name,
        password: hashedPassword,
      });

      return user.readOnlyData;
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new UnauthorizedException('이미 존재하는 계정입니다.');
      }
    }
  }

  async getRefreshToken(payload: { email: string; id: string }, res: Response) {
    const refresh = this.jwtService.sign(payload, {
      secret: jwtConstants.REFRESH_TOKEN,
      expiresIn: jwtConstants.REFRESH_EXPIRESIN,
    });

    await this.userService.setRefreshToken(refresh, payload.email);

    return res.cookie('Refresh', refresh, {
      domain: 'https://careerhub-front.netlify.app/',
      path: '/',
      httpOnly: true,
      sameSite: 'none',
    });
  }
  async getAceessToken(payload: { email: string; id: string }) {
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.ACCESS_TOKEN,
      expiresIn: jwtConstants.ACCESS_EXPIRESIN,
    });

    return token;
  }
  async login(data: LoginRequestDto, res: Response, isRefreshEmpty: boolean) {
    const { email } = data;
    const user = await this.userRepository.findUserByEmail(email);
    const payload = { email, id: user._id.toString() };
    const accessToken = await this.getAceessToken(payload);
    if (isRefreshEmpty) {
      await this.getRefreshToken(payload, res);
    }
    return { accessToken };
  }
  async logout(data: LogoutRequestDto) {
    const { email } = data;
    const refreshToken = null;
    return this.userRepository.updateRefreshToken(refreshToken, email);
  }
  async refresh(payload: { email: string; id: string }, res: Response) {
    const accessToken = await this.getAceessToken(payload);
    await this.getRefreshToken(payload, res);
    return accessToken;
  }
}
