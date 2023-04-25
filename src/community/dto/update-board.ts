import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardDto {
  @ApiProperty({
    example: '안녕하세요',
    description: 'title',
    required: true,
  })
  title?: string;

  @ApiProperty({
    example: '반가워요~',
    description: 'description',
  })
  description?: string;

  @ApiProperty({
    example: 'positionId',
    description: '채용공고 게시글 id',
  })
  positionArticle?: object;

  @ApiProperty({
    example: ['reactJS', 'nestJS'],
    description: '활용기술',
  })
  skill?: object;
}
