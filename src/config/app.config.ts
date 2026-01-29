import { ConfigService } from '@nestjs/config';
import { Env } from './env.schema';

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class AppConfig {
  constructor(private readonly config: ConfigService<Env, true>) {}
  get nodeEnv() {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get port() {
    return this.config.get('PORT', { infer: true });
  }

  get db(): DbConfig {
    return {
      host: this.config.get('DB_HOST', { infer: true }),
      port: this.config.get('DB_PORT', { infer: true }),
      user: this.config.get('DB_USER', { infer: true }),
      password: this.config.get('DB_PASSWORD', { infer: true }),
      database: this.config.get('DB_NAME', { infer: true }),
    };
  }
}
