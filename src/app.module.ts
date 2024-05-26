import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { allProviders } from './providers';

@Module({
  imports: [AppConfigModule.register({ envFilePath: '.env.development' })],
  controllers: [AppController],
  providers: [AppService, ...allProviders],
})
export class AppModule {}
