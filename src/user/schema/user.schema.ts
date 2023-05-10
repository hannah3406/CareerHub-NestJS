import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  _id: true,
  id: true,
};
export type userDocument = User & Document;
@Schema(options)
export class User {
  includes(_id: string) {
    throw new Error('Method not implemented.');
  }
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({})
  profileimg: string;

  @Prop({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @Prop({ type: [String] })
  view: string[];

  readonly readOnlyData: {
    email: string;
    name: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
