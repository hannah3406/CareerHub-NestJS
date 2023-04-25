import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { Comments } from './schema/comments.schema';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '댓글작성' })
  @Post('create')
  async createComment(@Body() comment: Comments): Promise<any> {
    return this.commentsService.createComment(comment);
  }
}
