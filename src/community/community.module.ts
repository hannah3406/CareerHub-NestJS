import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsModule } from 'src/comments/comments.module';
import { UserModule } from 'src/user/user.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Community, CommunitySchema } from './schema/community.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Community.name, schema: CommunitySchema },
    ]),
    UserModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
