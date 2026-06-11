import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { PersonsModule } from './persons/persons.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, MoviesModule, PersonsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
