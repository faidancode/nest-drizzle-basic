import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { DrizzleModule } from './infra/drizzle/drizzle.module';
import { AppConfig } from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/app-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppConfigModule,
    CategoriesModule,
    DrizzleModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfig],
})
export class AppModule {}
