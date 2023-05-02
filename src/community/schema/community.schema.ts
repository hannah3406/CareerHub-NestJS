import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  _id: true,
  id: true,
};
export type communityDocument = Community & Document;
type positionArticle = {
  positionId: string;
  title: string;
  company: string;
  url: string;
};
type userInfo = {
  userId: string;
  userName: string;
  profileimg: string;
};
@Schema(options)
export class Community {
  _id: Types.ObjectId;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop()
  @IsString()
  description: string;

  @Prop({
    type: Object,
  })
  positionArticle: positionArticle;

  @Prop({
    type: Object,
  })
  skill: object;

  @Prop({
    type: Object,
  })
  @IsNotEmpty()
  userInfo: userInfo;

  @Prop({
    type: Object,
  })
  like: object;

  @Prop({
    type: Number,
  })
  commentCnt: number;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
