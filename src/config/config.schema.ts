import { IsDefined, IsEnum, IsPort, IsString } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class AppConfigSchema {
  @IsDefined()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsDefined()
  @IsPort()
  PORT: number;

  @IsDefined()
  @IsString()
  MONGODB_URI: string;
}
