import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsNotEmpty({ message: 'DATA_FILE is required' })
  @IsString({ message: 'DATA_FILE must be a string' })
  DATA_FILE!: string;

  @IsOptional()
  @IsString({ message: 'PORT must be a string' })
  PORT?: string;

  @IsOptional()
  @IsString({ message: 'ALLOWED_ORIGINS must be a string' })
  ALLOWED_ORIGINS?: string;

  @IsOptional()
  @IsString({ message: 'NODE_ENV must be a string' })
  NODE_ENV?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const nodeEnv = (validatedConfig.NODE_ENV || 'development').toLowerCase();
  const isDevelopment = nodeEnv === 'development';

  if (!isDevelopment && !validatedConfig.ALLOWED_ORIGINS) {
    const validationError = {
      property: 'ALLOWED_ORIGINS',
      constraints: {
        isNotEmpty: 'ALLOWED_ORIGINS is required in non-development environments',
      },
      children: [],
      target: validatedConfig,
      value: undefined,
    };
    errors.push(validationError as (typeof errors)[0]);
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors
        .map(
          (error) => `  - ${error.property}: ${Object.values(error.constraints || {}).join(', ')}`
        )
        .join('\n')}`
    );
  }

  return validatedConfig;
}
