import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXP'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXP'),
    });

    const newExpiresAt = new Date(
      Date.now() + ms(this.configService.get<string>('JWT_REFRESH_EXP')),
    );

    // Store the refresh token in the database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expiresAt: newExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateOAuthLogin(data: any): Promise<any> {
    const { third_party_id, provider, email, name, picture } = data.user;
    if (!third_party_id && !provider && !email) {
      throw new UnauthorizedException('Invalid credentials');
    }
    let user = await this.prisma.users.findFirst({
      where: { third_party_id },
    });

    if (!user) {
      console.log('User not found');
      user = await this.prisma.users.create({
        data: {
          third_party_id,
          provider,
          email,
          name,
          picture,
        },
      });
    } else {
      console.log('User found');
      user = await this.prisma.users.update({
        where: { id: user.id },
        data: {
          email,
          name,
          picture,
        },
      });
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXP'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXP'),
    });

    const newExpiresAt = new Date(
      Date.now() + ms(this.configService.get<string>('JWT_REFRESH_EXP')),
    );

    // Store the refresh token in the database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expiresAt: newExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken || storedToken.user_id !== payload.sub) {
        throw new UnauthorizedException();
      }

      const newPayload = { email: payload.email, sub: payload.sub };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXP'),
      });
      // const newRefreshToken = this.jwtService.sign(newPayload, {
      //   expiresIn: this.configService.get<string>('JWT_REFRESH_EXP'),
      // });

      // const newExpiresAt = new Date(
      //   Date.now() + ms(this.configService.get<string>('JWT_REFRESH_EXP')),
      // );

      // Update the refresh token in the database
      // await this.prisma.refreshToken.update({
      //   where: { token },
      //   data: {
      //     token: newRefreshToken,
      //     expiresAt: newExpiresAt,
      //   },
      // });

      return {
        accessToken: newAccessToken,
        // refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(token: string) {
    // Delete the refresh token from the database
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }
}
