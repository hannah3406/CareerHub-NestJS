import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: '반가워요~',
    description: 'comment',
  })
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty({
    example: 'articleInfo',
    description: '게시글 id,title',
  })
  @IsNotEmpty()
  articleInfo: object;

  @ApiProperty({
    example: '작성자id',
    required: true,
  })
  @IsNotEmpty()
  userInfo: object;
}
