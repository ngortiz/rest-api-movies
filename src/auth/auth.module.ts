import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; // 1. Add this import!

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY_FOR_JWT', // IN PRODUCTION, USE ENVIRONMENT VARIABLES!
      signOptions: { expiresIn: '60m' }, // 60m (60 minutes) instead of 60 seconds
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController], // 2. Change AbortController to AuthController!
  exports: [AuthService],
})
export class AuthModule {}
