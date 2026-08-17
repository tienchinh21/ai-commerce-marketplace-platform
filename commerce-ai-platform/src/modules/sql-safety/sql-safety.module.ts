import { Module } from '@nestjs/common';
import { SqlSafetyService } from './sql-safety.service';

@Module({
  providers: [SqlSafetyService],
  exports: [SqlSafetyService],
})
export class SqlSafetyModule {}
