import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameInputDto {
  @ApiProperty({ description: 'ID of player X', example: 'playerX-id' })
  @IsString()
  @IsNotEmpty()
  playerX: string;

  @ApiProperty({ description: 'ID of player O', example: 'playerO-id' })
  @IsString()
  @IsNotEmpty()
  playerO: string;

  @ApiProperty({
    description: 'Size of the game board. Min 3 and max 10',
    example: 3,
  })
  @IsInt()
  @Min(3)
  @Max(10)
  size: number;
}
