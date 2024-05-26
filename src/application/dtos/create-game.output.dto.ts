import { ApiProperty } from '@nestjs/swagger';
import { GameStatus, Player } from '../../domain/game/entities/game.entity';

export class CreateGameOutputDto {
  @ApiProperty({ description: 'Unique ID of the game', example: 'unique-id' })
  id: string;

  @ApiProperty({ description: 'ID of player X', example: 'playerX-id' })
  playerX: string;

  @ApiProperty({ description: 'ID of player O', example: 'playerO-id' })
  playerO: string;

  @ApiProperty({ description: 'Size of the game board', example: 3 })
  size: number;

  @ApiProperty({
    description: 'Current status of the game',
    example: 'IN_PROGRESS',
  })
  status: GameStatus;

  @ApiProperty({ description: 'Winner of the game, if any', example: null })
  winner: Player | null;

  @ApiProperty({
    description: 'Moves made in the game',
    example: [{ player: 'X', row: 0, column: 0 }],
  })
  moves: { player: Player; row: number; column: number }[];
}
