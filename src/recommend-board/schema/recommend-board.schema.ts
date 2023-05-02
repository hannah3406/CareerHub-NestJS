import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  _id: true,
  id: true,
};
export type RecommendBoardDocument = RecommendBoard & Document;
export type TList = { id: string; score: number };
@Schema(options)
export class RecommendBoard {
  _id: Types.ObjectId;

  @Prop({ type: Object })
  list: TList[];
}

export const RecommendBoardSchema =
  SchemaFactory.createForClass(RecommendBoard);
