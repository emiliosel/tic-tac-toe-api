import * as mongoose from 'mongoose';
import { Provider } from '@nestjs/common';
import { MongooseGameRepository } from './infrastructure/database/repositories/game.repository';
import { GameMongoooseModelFactory } from './infrastructure/database/schemas/game.schema';
import { AppConfigService } from './config/config.service';
import { MongooseConnectionFactory } from './infrastructure/database/factories/MongooseConnectionFactory';
import { PROVIDERS } from './constants';
import { CreateGameUseCase } from './application/use-cases/create-game.usecase';
import { MakeMoveUseCase } from './application/use-cases/make-move.usecase';
import { GetFinishedGamesUseCase } from './application/use-cases/get-finished-games.usecase';
import { UpsertGameUseCase } from './application/use-cases/upsert-game.usecase';

export const mongooseDatabaseProviders: Provider[] = [
  {
    provide: PROVIDERS.DATABASE_CONNECTION,
    useFactory: (configService: AppConfigService): Promise<typeof mongoose> =>
      MongooseConnectionFactory.create(configService),
    inject: [AppConfigService],
  },
  {
    provide: PROVIDERS.GAME_MODEL,
    useFactory: GameMongoooseModelFactory.create,
    inject: [PROVIDERS.DATABASE_CONNECTION],
  },
  {
    provide: PROVIDERS.GAME_REPOSITORY,
    useClass: MongooseGameRepository,
  },
];

export const gameApplicationProviders: Provider[] = [
  {
    provide: PROVIDERS.GAME_CREATE_USECASE,
    useClass: CreateGameUseCase,
  },
  {
    provide: PROVIDERS.GAME_MAKEMOVE_USECASE,
    useClass: MakeMoveUseCase,
  },
  {
    provide: PROVIDERS.GAME_GET_FINISHED_USECASE,
    useClass: GetFinishedGamesUseCase,
  },
  {
    provide: PROVIDERS.GAME_UPSERT_USECASE,
    useClass: UpsertGameUseCase,
  },
];

export const allProviders: Provider[] = [
  ...mongooseDatabaseProviders,
  ...gameApplicationProviders,
];
