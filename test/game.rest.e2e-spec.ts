import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateGameInputDto } from '../src/application/dtos/create-game.input.dto';
import { MakeMoveInputDto } from '../src/application/dtos/make-move.input.dto';
import { GetFinishedGamesInputDto } from '../src/application/dtos/get-finished-games.input.dto';
import { GameStatus, Player } from '../src/domain/game/entities/game.entity';

describe('GameRestController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /games - should create a new game', async () => {
    const createGameDto: CreateGameInputDto = {
      playerX: 'playerX-id',
      playerO: 'playerO-id',
      size: 3,
    };
    const { body } = await request(app.getHttpServer())
      .post('/games')
      .send(createGameDto)
      .expect(201);

    expect(body).toBeDefined();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('playerX', createGameDto.playerX);
    expect(body).toHaveProperty('playerO', createGameDto.playerO);
    expect(body).toHaveProperty('size', createGameDto.size);
    expect(body).toHaveProperty('status', GameStatus.IN_PROGRESS);
    expect(body).toHaveProperty('moves', []);
    expect(body).toHaveProperty('winner', null);
  });

  it('PUT /games/move - should make a move in an existing game', async () => {
    const createGameDto: CreateGameInputDto = {
      playerX: 'playerX-id',
      playerO: 'playerO-id',
      size: 3,
    };
    const { body: createGameOutput } = await request(app.getHttpServer())
      .post('/games')
      .send(createGameDto)
      .expect(201);

    const makeMoveDto: MakeMoveInputDto = {
      gameId: createGameOutput.id, // Ensure this matches the property name returned by the create endpoint
      player: Player.X,
      row: 0,
      column: 0,
    };

    const { body } = await request(app.getHttpServer())
      .put('/games/move')
      .send(makeMoveDto)
      .expect(200);

    expect(body).toBeDefined();
    expect(body).toHaveProperty('gameId', makeMoveDto.gameId);
    expect(body).toHaveProperty('status', GameStatus.IN_PROGRESS);
    expect(body).toHaveProperty('winner', null);
    expect(body.moves).toBeDefined();
    expect(body.moves.length).toBe(1);
    expect(body.moves[0]).toEqual({
      player: makeMoveDto.player,
      row: makeMoveDto.row,
      column: makeMoveDto.column,
    });
  });

  it('GET /games - should get finished games', async () => {
    const createGameDto: CreateGameInputDto = {
      playerX: 'playerX-id',
      playerO: 'playerO-id',
      size: 3,
    };

    // Create and finish a game
    const { body: createGameOutput1 } = await request(app.getHttpServer())
      .post('/games')
      .send(createGameDto)
      .expect(201);

    const makeMoveDtos = [
      { gameId: createGameOutput1.id, player: Player.X, row: 0, column: 0 },
      { gameId: createGameOutput1.id, player: Player.O, row: 0, column: 1 },
      { gameId: createGameOutput1.id, player: Player.X, row: 1, column: 0 },
      { gameId: createGameOutput1.id, player: Player.O, row: 1, column: 1 },
      { gameId: createGameOutput1.id, player: Player.X, row: 2, column: 0 },
    ];

    for (const move of makeMoveDtos) {
      await request(app.getHttpServer())
        .put('/games/move')
        .send(move)
        .expect(200);
    }

    // Fetch finished games
    const filterOptions: GetFinishedGamesInputDto = {
      status: GameStatus.FINISHED,
    };

    const { body } = await request(app.getHttpServer())
      .get('/games')
      .query(filterOptions)
      .expect(200);

    expect(body).toBeDefined();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    const finishedGame = body.find(
      (game) => game.gameId === createGameOutput1.id,
    );

    expect(finishedGame).toBeDefined();
    expect(finishedGame).toHaveProperty('gameId', createGameOutput1.id);
    expect(finishedGame).toHaveProperty('playerX', createGameDto.playerX);
    expect(finishedGame).toHaveProperty('playerO', createGameDto.playerO);
    expect(finishedGame).toHaveProperty('size', createGameDto.size);
    expect(finishedGame).toHaveProperty('status', GameStatus.FINISHED);
    expect(finishedGame).toHaveProperty('winner', Player.X);
    expect(finishedGame.moves).toBeDefined();
    expect(finishedGame.moves.length).toBe(makeMoveDtos.length);

    body.forEach((game: any) => {
      expect(game).toHaveProperty('status', GameStatus.FINISHED);
    });
  });

  it('GET /games - should get in progress games', async () => {
    const createGameDto: CreateGameInputDto = {
      playerX: 'playerX-id',
      playerO: 'playerO-id',
      size: 3,
    };

    // Create a game on progress
    await request(app.getHttpServer())
      .post('/games')
      .send(createGameDto)
      .expect(201);

    // Fetch in-progress games
    const filterOptions: GetFinishedGamesInputDto = {
      status: GameStatus.IN_PROGRESS,
    };

    const { body } = await request(app.getHttpServer())
      .get('/games')
      .query(filterOptions)
      .expect(200);

    expect(body).toBeDefined();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    // Check that all returned games are in progress
    body.forEach((game: any) => {
      expect(game).toHaveProperty('status', GameStatus.IN_PROGRESS);
    });
  });
});
