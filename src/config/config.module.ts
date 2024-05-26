// src/config/config.module.ts
import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './config.service';
import * as dotenv from 'dotenv';

export interface ConfigOptions {
  envFilePath?: string;
}

@Global()
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {
  static register(options: ConfigOptions) {
    const { envFilePath } = options;
    if (envFilePath) {
      dotenv.config({ path: envFilePath }); // Load .env file based on provided path
    }
    return {
      module: AppConfigModule,
      providers: [AppConfigService],
      exports: [AppConfigService],
    };
  }
}
