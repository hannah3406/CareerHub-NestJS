import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
type boardInfo = {
  boardId: string;
  title: string;
};
export class CreateCommentDto {
  @ApiProperty({
    example: '반가워요~',
    description: 'comment',
  })
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty({
    example: 'boardInfo',
    description: '게시글 id,title',
  })
  @IsNotEmpty()
  boardInfo: boardInfo;

  @ApiProperty({
    example: '작성자id',
    required: true,
  })
  @IsNotEmpty()
  userInfo: object;
}
