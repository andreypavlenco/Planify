import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload, AuthTokens } from '../types';

@Injectable()
export class JwtTokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
    this.refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    this.accessTokenExpiry =
      this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || '40m';
    this.refreshTokenExpiry =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';

    if (!this.accessTokenSecret || !this.refreshTokenSecret) {
      throw new Error(
        'ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set in the environment variables.',
      );
    }
  }

  generateAccessToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiry,
    });
  }
  generateRefreshToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiry,
    });
  }
  async generateTokens(payload: AuthPayload): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
