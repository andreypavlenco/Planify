import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayload } from '../types';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });

    const secret = configService.get<string>('ACCESS_TOKEN_SECRET');
    if (!secret) {
      throw new Error(
        'ACCESS_TOKEN_SECRET is not set in the environment variables.',
      );
    }
  }

  async validate(payload: AuthPayload): Promise<AuthPayload> {
    if (!payload || !payload.id || !payload.email) {
      throw new UnauthorizedException('Invalid authentication payload.');
    }

    return payload;
  }
}
