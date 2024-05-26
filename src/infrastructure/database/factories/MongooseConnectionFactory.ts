import * as mongoose from 'mongoose';
import { AppConfigService } from 'src/config/config.service';

export class MongooseConnectionFactory {
  public static create(configService: AppConfigService) {
    return mongoose.connect(configService.config.MONGODB_URI);
  }
}
