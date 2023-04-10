import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  _id: true,
  id: true,
};
export type WebCrawlingDocument = WebCrawling & Document;
@Schema(options)
export class WebCrawling {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  url: string;

  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @Prop({
    type: String,
  })
  @IsNotEmpty()
  description: string;

  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  majorTasks: string;

  @Prop({
    type: String,
  })
  @IsNotEmpty()
  experience: string;

  @Prop({
    type: String,
  })
  @IsNotEmpty()
  preferential: string;

  @Prop({
    type: String,
  })
  @IsNotEmpty()
  welfare: string;

  @Prop({
    type: Object,
  })
  @IsNotEmpty()
  skill: string;

  @Prop({
    type: String,
  })
  @IsNotEmpty()
  location: string;

  @Prop({
    type: String,
  })
  @IsNotEmpty()
  locationDetail: string;

  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  company: string;

  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  type: string;

  @Prop({
    type: String,
  })
  @IsNotEmpty()
  closingdate: string;
}

export const WebCrawlingSchema = SchemaFactory.createForClass(WebCrawling);
