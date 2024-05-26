import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Game, GameStatus } from '../../../domain/game/entities/game.entity';
import { FindGamesFilter } from '../../../domain/game/repositories/game.repository';
import { MongooseGameRepository } from './game.repository';
import { PROVIDERS } from '../../../constants';
import { GameDocument } from '../schemas/game.schema';

describe('MongooseGameRepository', () => {
  let repository: MongooseGameRepository;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let gameModel: Model<GameDocument>;

  const mockGameModel = {
    findById: jest.fn(),
    find: jest.fn(),
    save: jest.fn().mockImplementation(function () {
      return this;
    }),
    create: jest.fn(),
    exec: jest.fn(),
  };

  const game: Game = new Game(
    '1',
    'playerX',
    'playerO',
    3,
    [],
    GameStatus.IN_PROGRESS,
    null,
  );

  const gameDoc = {
    _id: '1',
    playerX: 'playerX',
    playerO: 'playerO',
    size: 3,
    moves: [],
    status: GameStatus.IN_PROGRESS,
    winner: null,
    save: jest.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseGameRepository,
        {
          provide: PROVIDERS.GAME_MODEL,
          useValue: mockGameModel,
        },
      ],
    }).compile();

    repository = module.get<MongooseGameRepository>(MongooseGameRepository);
    gameModel = module.get<Model<GameDocument>>(PROVIDERS.GAME_MODEL);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a new game', async () => {
      (mockGameModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await repository.save(game);

      expect(mockGameModel.findById).toHaveBeenCalledWith('1');
      expect(mockGameModel.create).toHaveBeenCalled();
    });

    it('should update an existing game', async () => {
      (mockGameModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(gameDoc),
      });

      await repository.save(game);

      expect(mockGameModel.findById).toHaveBeenCalledWith('1');
      expect(gameDoc.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a game if it exists', async () => {
      (mockGameModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(gameDoc),
      });

      const foundGame = await repository.findById('1');

      expect(foundGame).toEqual(game);
    });

    it('should return null if game does not exist', async () => {
      (mockGameModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const foundGame = await repository.findById('1');

      expect(foundGame).toBeNull();
    });
  });

  describe('findGames', () => {
    it('should return games based on filter', async () => {
      const filter: FindGamesFilter = {
        where: { status: GameStatus.IN_PROGRESS },
      };
      (mockGameModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([gameDoc]),
      });

      const games = await repository.findGames(filter);

      expect(mockGameModel.find).toHaveBeenCalledWith({
        status: GameStatus.IN_PROGRESS,
      });
      expect(games).toEqual([game]);
    });

    it('should return all games if no filter is provided', async () => {
      (mockGameModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([gameDoc]),
      });

      const games = await repository.findGames();

      expect(mockGameModel.find).toHaveBeenCalledWith({});
      expect(games).toEqual([game]);
    });
  });
});
