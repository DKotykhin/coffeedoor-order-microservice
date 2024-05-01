import { IsNotEmpty, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Logger } from '@nestjs/common';

const logger = new Logger('env.validator.ts');

class EnvironmentVariables {
  @IsNotEmpty()
  TRANSPORT_PORT: string;

  @IsNotEmpty()
  TRANSPORT_HOST: string;

  @IsNotEmpty()
  PG_HOST: string;

  @IsNotEmpty()
  PG_DATABASE: string;

  @IsNotEmpty()
  PG_USER: string;

  @IsNotEmpty()
  PG_PASSWORD: string;

  @IsNotEmpty()
  PG_PORT: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    logger.error(errors.toString(), {
      ...errors.map(
        (error) =>
          `${Object.values(error.constraints)} | value: ${error.value}`,
      ),
    });
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
