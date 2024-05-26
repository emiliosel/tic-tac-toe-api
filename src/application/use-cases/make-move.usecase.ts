import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameRepository } from '../../domain/game/repositories/game.repository';
import { PROVIDERS } from '../../constants';
import { MakeMoveInputDto } from '../dtos/make-move.input.dto';
import { MakeMoveOutputDto } from '../dtos/make-move.output.dto';

@Injectable()
export class MakeMoveUseCase {
  constructor(
    @Inject(PROVIDERS.GAME_REPOSITORY)
    private readonly gameRepository: GameRepository,
  ) {}

  async execute(input: MakeMoveInputDto): Promise<MakeMoveOutputDto> {
    const { gameId, player, row, column } = input;
    const game = await this.gameRepository.findById(gameId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    try {
      game.makeMove(row, column, player);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }

    await this.gameRepository.save(game);

    return {
      gameId: game.id,
      status: game.status,
      winner: game.winner,
      moves: game.moves,
    };
  }
}
