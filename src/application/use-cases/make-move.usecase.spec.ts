import { Test, TestingModule } from '@nestjs/testing';
import { MakeMoveUseCase } from './make-move.usecase';
import { GameRepository } from '../../domain/game/repositories/game.repository';
import { PROVIDERS } from '../../constants';
import { MakeMoveInputDto } from '../dtos/make-move.input.dto';
import {
  Game,
  GameStatus,
  Player,
} from '../../domain/game/entities/game.entity';

describe('MakeMoveUseCase', () => {
  let useCase: MakeMoveUseCase;
  let gameRepository: GameRepository;

  const mockGameRepository = {
    save: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeMoveUseCase,
        {
          provide: PROVIDERS.GAME_REPOSITORY,
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    useCase = module.get<MakeMoveUseCase>(MakeMoveUseCase);
    gameRepository = module.get<GameRepository>(PROVIDERS.GAME_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should make a valid move', async () => {
    const game = new Game('game-id', 'playerX-id', 'playerO-id', 3);
    mockGameRepository.findById.mockResolvedValue(game);

    const input: MakeMoveInputDto = {
      gameId: 'game-id',
      player: Player.X,
      row: 0,
      column: 0,
    };

    const result = await useCase.execute(input);

    expect(result).toEqual({
      gameId: 'game-id',
      status: GameStatus.IN_PROGRESS,
      winner: null,
      moves: [{ player: Player.X, row: 0, column: 0 }],
    });
    expect(gameRepository.save).toHaveBeenCalledWith(game);
  });

  it('should throw an error if the game is not found', async () => {
    mockGameRepository.findById.mockResolvedValue(null);

    const input: MakeMoveInputDto = {
      gameId: 'invalid-game-id',
      player: Player.X,
      row: 0,
      column: 0,
    };

    await expect(useCase.execute(input)).rejects.toThrow('Game not found');
  });

  it('should throw an error if the move is invalid', async () => {
    const game = new Game('game-id', 'playerX-id', 'playerO-id', 3);
    mockGameRepository.findById.mockResolvedValue(game);

    game.makeMove(0, 0, Player.X); // Make a move at (0, 0)

    const input: MakeMoveInputDto = {
      gameId: 'game-id',
      player: Player.O,
      row: 0,
      column: 0,
    };

    await expect(useCase.execute(input)).rejects.toThrow('Invalid move');
  });
});
