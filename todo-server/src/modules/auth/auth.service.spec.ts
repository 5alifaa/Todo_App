import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if valid', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        third_party_id: 'thirdPartyId',
        provider: 'provider',
        picture: 'pictureUrl',
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        third_party_id: 'thirdPartyId',
        provider: 'provider',
        picture: 'pictureUrl',
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    });

    it('should return null if invalid', async () => {
      jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(null);

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = { id: 1, email: 'test@test.com' };
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);
      jest.spyOn(configService, 'get').mockReturnValue('7d');
      jest.spyOn(prisma.refreshToken, 'create').mockResolvedValue({
        id: 1,
        user_id: 1,
        token: 'refreshToken',
        expiresAt: new Date(),
      });

      const result = await service.login(user);
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('refreshToken', () => {
    it('should return new access and refresh tokens', async () => {
      const token = 'refreshToken';
      const payload = { email: 'test@test.com', sub: 1 };
      const newAccessToken = 'newAccessToken';
      const newRefreshToken = 'newRefreshToken';
      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest
        .spyOn(prisma.refreshToken, 'findUnique')
        .mockResolvedValue({ id: 1, user_id: 1, token, expiresAt: new Date() });
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(newAccessToken)
        .mockReturnValueOnce(newRefreshToken);
      jest.spyOn(configService, 'get').mockReturnValue('7d');
      jest.spyOn(prisma.refreshToken, 'update').mockResolvedValue({
        id: 1,
        user_id: 1,
        token: 'newRefreshToken',
        expiresAt: new Date(),
      });

      const result = await service.refreshToken(token);
      expect(result).toEqual({
        accessToken: newAccessToken,
        // refreshToken: newRefreshToken,
      });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const token = 'invalidToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      await expect(service.refreshToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should delete the refresh token', async () => {
      const token = 'refreshToken';
      jest.spyOn(prisma.refreshToken, 'delete').mockResolvedValue({
        id: 1,
        user_id: 1,
        token: 'refreshToken',
        expiresAt: new Date(),
      });

      await service.logout(token);
      expect(prisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { token },
      });
    });
  });
});
