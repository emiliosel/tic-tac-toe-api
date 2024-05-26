import * as mongoose from 'mongoose';
import { Provider } from '@nestjs/common';
import { MongooseGameRepository } from './infrastructure/database/repositories/game.repository';
import { GameMongoooseModelFactory } from './infrastructure/database/schemas/game.schema';
import { AppConfigService } from './config/config.service';
import { MongooseConnectionFactory } from './infrastructure/database/factories/MongooseConnectionFactory';
import { PROVIDERS } from './constants';

export const databaseProviders: Provider[] = [
  {
    provide: PROVIDERS.DATABASE_CONNECTION,
    useFactory: (configService: AppConfigService): Promise<typeof mongoose> =>
      MongooseConnectionFactory.create(configService),
    inject: [AppConfigService],
  },
];

export const gameProviders: Provider[] = [
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

export const allProviders: Provider[] = [
  ...databaseProviders,
  ...gameProviders,
];
