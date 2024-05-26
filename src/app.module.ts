import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule.register({ envFilePath: '.env.development' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
