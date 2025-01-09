import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to use environment variables
    PrismaModule, // Import Prisma module to interact with the database
    PassportModule, // Enable Passport authentication strategies //TODO register default strategy
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use your JWT secret
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXP }, // Default access token expiration
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy], // Provide AuthService and JwtStrategy
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {}
