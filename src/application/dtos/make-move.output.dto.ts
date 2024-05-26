import { ApiProperty } from '@nestjs/swagger';
import { GameStatus, Player } from '../../domain/game/entities/game.entity';

export class MakeMoveOutputDto {
  @ApiProperty({ description: 'ID of the game', example: 'game-id' })
  gameId: string;

  @ApiProperty({
    description: 'Current status of the game',
    example: Object.keys(GameStatus).join(', '),
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
