import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Response } from 'express';
import { ObjectId } from 'mongoose';
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
      throw new HttpException('계정이 없습니다', HttpStatus.BAD_REQUEST);
    }
  }
  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordVaildated: boolean = await bcrypt.compare(
      password,
      hashedPassword,
    );
    if (!isPasswordVaildated) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`사용자 정보가 일치하지 않습니다.`],
        error: 'Forbidden',
      });
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
        throw new HttpException(
          '이미 존재하는 계정입니다',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async getRefreshToken(
    payload: { email: string; sub: string },
    res: Response,
  ) {
    const refresh = this.jwtService.sign(payload, {
      secret: jwtConstants.REFRESH_TOKEN,
      expiresIn: jwtConstants.REFRESH_EXPIRESIN,
    });

    await this.userService.setRefreshToken(refresh, payload.email);

    return res.cookie('Refresh', refresh, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'none',
    });
  }
  async getAceessToken(payload: { email: string; sub: string }) {
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.ACCESS_TOKEN,
      expiresIn: jwtConstants.ACCESS_EXPIRESIN,
    });
    console.log(payload, 'payload');
    console.log(token);

    return token;
  }
  async login(data: LoginRequestDto, res: Response, isRefreshEmpty: boolean) {
    const { email } = data;
    console.log(email, 'user.email');
    const user = await this.userRepository.findUserByEmail(email);
    const payload = { email, sub: user.name };

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
  async refresh(payload: { email: string; sub: string }, res: Response) {
    const accessToken = await this.getAceessToken(payload);
    await this.getRefreshToken(payload, res);
    return accessToken;
  }
}
