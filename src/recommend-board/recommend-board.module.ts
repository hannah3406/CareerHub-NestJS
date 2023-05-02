import { Module } from '@nestjs/common';
import { RecommendBoardService } from './recommend-board.service';
import { RecommendBoardController } from './recommend-board.controller';
import { CommunityModule } from 'src/community/community.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RecommendBoard,
  RecommendBoardSchema,
} from './schema/recommend-board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecommendBoard.name, schema: RecommendBoardSchema },
    ]),
    CommunityModule,
  ],
  providers: [RecommendBoardService],
  controllers: [RecommendBoardController],
})
export class RecommendBoardModule {}
