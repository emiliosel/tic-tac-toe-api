import { Test, TestingModule } from '@nestjs/testing';
import { CreateGameUseCase } from './create-game.usecase';
import { GameRepository } from '../../domain/game/repositories/game.repository';
import { Game, GameStatus } from '../../domain/game/entities/game.entity';
import { PROVIDERS } from '../../constants';
import { CreateGameInputDto } from '../dtos/create-game.input.dto';
import { CreateGameOutputDto } from '../dtos/create-game.output.dto';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('unique-id'),
}));

describe('CreateGameUseCase', () => {
  let useCase: CreateGameUseCase;
  let gameRepository: GameRepository;

  const mockGameRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateGameUseCase,
        {
          provide: PROVIDERS.GAME_REPOSITORY,
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateGameUseCase>(CreateGameUseCase);
    gameRepository = module.get<GameRepository>(PROVIDERS.GAME_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create and save a new game', async () => {
    const input: CreateGameInputDto = {
      playerX: 'playerX',
      playerO: 'playerO',
      size: 3,
    };

    const expectedOutput: CreateGameOutputDto = {
      id: 'unique-id',
      playerX: 'playerX',
      playerO: 'playerO',
      size: 3,
      status: GameStatus.IN_PROGRESS,
      winner: null,
      moves: [],
    };

    const result = await useCase.execute(input);

    expect(result).toEqual(expectedOutput);
    expect(gameRepository.save).toHaveBeenCalledWith(expect.any(Game));
  });
});
