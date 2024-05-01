import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get('PG_HOST'),
  port: parseInt(configService.get('PG_PORT')),
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_DATABASE'),
  // entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,
  ssl: configService.get('PG_SSL') === 'true',
  extra: {
    ssl:
      configService.get('PG_SSL') === 'true'
        ? { rejectUnauthorized: false }
        : null,
  },
});
