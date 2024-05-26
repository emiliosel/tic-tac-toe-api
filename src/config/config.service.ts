import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfigSchema } from './config.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  readonly config: AppConfigSchema;

  constructor() {
    const validatedConfig = plainToInstance(AppConfigSchema, process.env);

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.toString()}`);
    }

    this.config = validatedConfig;
  }
}
