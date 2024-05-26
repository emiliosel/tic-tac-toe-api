import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { allProviders } from './providers';
import { GameRestController } from './api/rest/game.controller';

@Module({
  imports: [AppConfigModule.register({ envFilePath: '.env.development' })],
  controllers: [GameRestController],
  providers: [...allProviders],
})
export class AppModule {}
