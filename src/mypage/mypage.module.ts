import { Module } from '@nestjs/common';
import { CommentsModule } from 'src/comments/comments.module';
import { CommunityModule } from 'src/community/community.module';
import { UserModule } from 'src/user/user.module';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';

@Module({
  imports: [UserModule, CommunityModule, CommentsModule],
  controllers: [MypageController],
  providers: [MypageService],
  exports: [MypageService],
})
export class MypageModule {}
