import { Inject, Injectable } from '@nestjs/common';
import { Game } from '../../domain/game/entities/game.entity';
import {
  GameRepository,
  FindGamesFilter,
} from '../../domain/game/repositories/game.repository';
import { GetFinishedGamesInputDto } from '../dtos/get-finished-games.input.dto';
import { GetFinishedGamesOutputDto } from '../dtos/get-finished-games.output.dto';
import { PROVIDERS } from '../../constants';

@Injectable()
export class GetFinishedGamesUseCase {
  constructor(
    @Inject(PROVIDERS.GAME_REPOSITORY)
    private readonly gameRepository: GameRepository,
  ) {}

  async execute(
    filterOptions?: GetFinishedGamesInputDto,
  ): Promise<GetFinishedGamesOutputDto[]> {
    const filter: FindGamesFilter = {};
    if (filterOptions?.status) {
      filter.where = { status: filterOptions.status };
    }

    const finishedGames = await this.gameRepository.findGames(filter);

    return finishedGames.map((game: Game) => ({
      gameId: game.id,
      playerX: game.playerX,
      playerO: game.playerO,
      size: game.size,
      status: game.status,
      winner: game.winner,
      moves: game.moves,
    }));
  }
}
