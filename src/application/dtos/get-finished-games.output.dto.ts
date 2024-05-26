import { ApiProperty } from '@nestjs/swagger';
import { GameStatus, Player } from 'src/domain/game/entities/game.entity';

export class GetFinishedGamesOutputDto {
  @ApiProperty({ description: 'ID of the game', example: 'game-id' })
  gameId: string;

  @ApiProperty({ description: 'ID of player X', example: 'playerX-id' })
  playerX: string;

  @ApiProperty({ description: 'ID of player O', example: 'playerO-id' })
  playerO: string;

  @ApiProperty({ description: 'Size of the board', example: 3 })
  size: number;

  @ApiProperty({
    description: 'Current status of the game',
    example: Object.values(GameStatus).join(', '),
  })
  status: GameStatus;

  @ApiProperty({ description: 'Winner of the game, if any', example: 'X' })
  winner: Player | null;

  @ApiProperty({
    description: 'Moves made in the game',
    example: [{ player: 'X', row: 0, column: 0 }],
  })
  moves: { player: Player; row: number; column: number }[];
}
