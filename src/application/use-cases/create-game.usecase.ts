import { Injectable, Inject } from '@nestjs/common';
import { Game } from '../../domain/game/entities/game.entity';
import { GameRepository } from '../../domain/game/repositories/game.repository';
import { PROVIDERS } from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import { CreateGameInputDto } from '../dtos/create-game.input.dto';
import { CreateGameOutputDto } from '../dtos/create-game.output.dto';

@Injectable()
export class CreateGameUseCase {
  constructor(
    @Inject(PROVIDERS.GAME_REPOSITORY)
    private readonly gameRepository: GameRepository,
  ) {}

  async execute(input: CreateGameInputDto): Promise<CreateGameOutputDto> {
    // Generate a unique ID for the new game
    const id = uuidv4();

    // Create a new game instance
    const game = new Game(id, input.playerX, input.playerO, input.size);

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
