import { ApiProperty } from '@nestjs/swagger';
import { GameStatus } from 'src/domain/game/entities/game.entity';

export class GetFinishedGamesInputDto {
  @ApiProperty({
    description: `Filter games by status. Available options: ${Object.values(GameStatus).join(', ')}`,
    example: GameStatus.FINISHED,
    required: false,
  })
  status?: GameStatus;
}
