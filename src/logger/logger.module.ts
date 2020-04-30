import { Module } from '@nestjs/common';
import { Logger } from './logger.service';

export { Logger, LoggerInstance } from './logger.service';

@Module({
  exports: [Logger],
  providers: [Logger],
})
export class LoggerModule {}
