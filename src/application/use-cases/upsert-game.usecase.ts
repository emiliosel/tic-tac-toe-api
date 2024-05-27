import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Game } from '../../domain/game/entities/game.entity';
import { GameRepository } from '../../domain/game/repositories/game.repository';
import { PROVIDERS } from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import { CreateGameOutputDto } from '../dtos/create-game.output.dto';
import { UpserGameInputDto } from '../dtos/upsert-game.input.dto';

@Injectable()
export class UpsertGameUseCase {
  constructor(
    @Inject(PROVIDERS.GAME_REPOSITORY)
    private readonly gameRepository: GameRepository,
  ) {}

  async execute(input: UpserGameInputDto): Promise<CreateGameOutputDto> {
    // Generate a unique ID if doesn't exist
    const id = input.gameId || uuidv4();

    // Create a new game instance
    const game = new Game(id, input.playerX, input.playerO, input.size);

    // Try to validate game moves and state
    try {
      input.moves.forEach((move) => {
        game.makeMove(move.row, move.column, move.player);
      });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }

    // Save the game using the repository
    await this.gameRepository.save(game);

    // Return the created game as an output DTO
    return {
      id: game.id,
      playerX: game.playerX,
      playerO: game.playerO,
      size: game.size,
      status: game.status,
      winner: game.winner,
      moves: game.moves,
    };
  }
}
