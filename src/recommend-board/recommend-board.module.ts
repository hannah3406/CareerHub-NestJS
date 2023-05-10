import { forwardRef, Module } from '@nestjs/common';
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
    forwardRef(() => CommunityModule),
  ],
  providers: [RecommendBoardService],
  controllers: [RecommendBoardController],
  exports: [RecommendBoardService],
})
export class RecommendBoardModule {}
