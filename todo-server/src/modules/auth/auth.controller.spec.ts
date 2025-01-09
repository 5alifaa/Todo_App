import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UnauthorizedException } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 60,
            limit: 10,
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
            validateOAuthLogin: jest.fn(),
          },
        },
        ThrottlerGuard,
        {
          provide: ThrottlerStorage,
          useValue: {
            getRecord: jest.fn(),
            addRecord: jest.fn(),
          },
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
      };
      const result = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashedPassword',
        third_party_id: 'thirdPartyId',
        provider: 'provider',
        picture: 'pictureUrl',
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const user = { id: 1, email: 'test@test.com' };
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(authService, 'login').mockResolvedValue(tokens);

      expect(await controller.login(loginDto)).toEqual(tokens);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new access and refresh tokens', async () => {
      const refreshToken = 'refreshToken';
      const tokens = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(tokens);

      expect(await controller.refreshToken(refreshToken)).toEqual(tokens);
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const refreshToken = 'refreshToken';
      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      expect(await controller.logout(refreshToken)).toEqual({
        message: 'Logged out successfully',
      });
    });
  });

  describe('googleAuth', () => {
    it('should initiate Google OAuth login', async () => {
      // This test is a placeholder as the actual OAuth flow is handled by Passport
      await expect(controller.googleAuth()).resolves.toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should handle Google OAuth redirect', async () => {
      const req = { user: { id: 'googleId', email: 'test@test.com' } };
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest.spyOn(authService, 'validateOAuthLogin').mockResolvedValue(tokens);

      expect(await controller.googleAuthRedirect(req)).toEqual(tokens);
    });
  });

  describe('facebookAuth', () => {
    it('should initiate Facebook OAuth login', async () => {
      // This test is a placeholder as the actual OAuth flow is handled by Passport
      expect(controller.facebookAuth()).resolves.toBeUndefined();
    });
  });

  describe('facebookAuthRedirect', () => {
    it('should handle Facebook OAuth redirect', async () => {
      const req = { user: { id: 'facebookId', email: 'test@test.com' } };
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest.spyOn(authService, 'validateOAuthLogin').mockResolvedValue(tokens);

      expect(await controller.facebookAuthRedirect(req)).toEqual(tokens);
    });
  });
});
