import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'name or profileimg',
    description: 'type',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: '96 or test',
    description: 'value',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
