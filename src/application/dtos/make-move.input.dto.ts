import { IsString, IsInt, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Player } from '../../domain/game/entities/game.entity';

export class MakeMoveInputDto {
  @ApiProperty({ description: 'ID of the game', example: 'game-id' })
  @IsString()
  gameId: string;

  @ApiProperty({ description: 'Player making the move', example: 'X' })
  @IsEnum(Player)
  player: Player;

  @ApiProperty({ description: 'Row index coordinate of the move', example: 0 })
  @IsInt()
  @Min(0)
  row: number;

  @ApiProperty({
    description: 'Column index coordinate of the move',
    example: 0,
  })
  @IsInt()
  @Min(0)
  column: number;
}
