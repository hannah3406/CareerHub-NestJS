import { Injectable } from '@nestjs/common';
import { CommunityService } from 'src/community/community.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MypageService {
  constructor(
    private readonly communityService: CommunityService,
    private readonly userService: UserService,
  ) {}
  async getMyViewBoard(id: string) {
    const view = await this.userService.getMyViewBoard(id);
    return await this.communityService.findViewBoard(view);
  }
}
