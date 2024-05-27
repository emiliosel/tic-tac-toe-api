import {
  IsString,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Player } from '../../domain/game/entities/game.entity';
import { Type } from 'class-transformer';

export class MoveDto {
  @IsEnum(Player)
  player: Player;

  @IsInt()
  @Min(0)
  row: number;

  @IsInt()
  @Min(0)
  column: number;
}

export class UpserGameInputDto {
  @ApiProperty({ description: 'ID of game', example: 'game-id' })
  @IsString()
  @IsOptional()
  gameId?: string;

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

  @ApiProperty({
    description: 'Moves made in the game',
    example: [{ player: 'X', row: 0, column: 0 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoveDto)
  moves: MoveDto[];
}
