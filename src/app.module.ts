import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { allProviders } from './providers';
import { GameRestController } from './api/rest/game.controller';

@Module({
  imports: [AppConfigModule.register({ envFilePath: '.env.development' })],
  controllers: [AppController, GameRestController],
  providers: [AppService, ...allProviders],
})
export class AppModule {}
