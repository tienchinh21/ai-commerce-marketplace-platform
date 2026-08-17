import { Module, OnModuleDestroy } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { AiEnv } from '../config/env';
import { loadEnv } from '../config/env';

export function createTypeOrmOptions(env: AiEnv): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: env.db.host,
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
    database: env.db.name,
    synchronize: false,
    autoLoadEntities: false,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => createTypeOrmOptions(loadEnv()),
    }),
  ],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleDestroy(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}
