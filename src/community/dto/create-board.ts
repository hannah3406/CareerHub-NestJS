import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    example: '안녕하세요',
    description: 'title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '반가워요~',
    description: 'description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'positionId',
    description: '채용공고 게시글 id',
  })
  @IsString()
  @IsNotEmpty()
  positionArticle: object;

  @ApiProperty({
    example: ['reactJS', 'nestJS'],
    description: '활용기술',
  })
  @IsString()
  @IsNotEmpty()
  skill: object;

  @ApiProperty({
    example: '작성자id',
    required: true,
  })
  @IsNotEmpty()
  userInfo: object;
}
