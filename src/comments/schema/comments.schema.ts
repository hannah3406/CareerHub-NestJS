import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  _id: true,
  id: true,
};

export type commentsDocument = Comments & Document;
type boardInfo = {
  boardId: string;
  title: string;
};
type userInfo = {
  userId: string;
  userName: string;
  profileimg: string;
};

@Schema(options)
export class Comments {
  _id: Types.ObjectId;

  @Prop()
  @IsString()
  contents: string;

  @Prop({
    type: Object,
  })
  boardInfo: boardInfo;

  @Prop({
    type: Object,
  })
  @IsNotEmpty()
  userInfo: userInfo;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
