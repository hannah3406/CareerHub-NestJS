import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WebCrawlingModule } from './web-crawling/web-crawling.module';
import { CommunityModule } from './community/community.module';
import { CommentsModule } from './comments/comments.module';
import { MypageController } from './mypage/mypage.controller';
import { MypageService } from './mypage/mypage.service';
import { MypageModule } from './mypage/mypage.module';
import { RecommendBoardModule } from './recommend-board/recommend-board.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UserModule,
    AuthModule,
    CommunityModule,
    WebCrawlingModule,
    CommentsModule,
    MypageModule,
    RecommendBoardModule,
  ],
  controllers: [AppController, MypageController],
  providers: [AppService, MypageService],
})
export class AppModule {}
