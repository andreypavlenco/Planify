import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayload } from '../types';
import { WinstonLoggerService } from 'src/core/utils/logger';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService,
  ) {
    const secret = configService.get<string>('ACCESS_TOKEN_SECRET');
    if (!secret) {
      const errorMessage =
        'ACCESS_TOKEN_SECRET is not set in the environment variables.';
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.logger.info('JwtAccessTokenStrategy initialized successfully.');
  }

  async validate(payload: AuthPayload): Promise<AuthPayload> {
    this.logger.debug('Validating JWT payload:', { payload });

    if (!payload || !payload.id || !payload.email) {
      this.logger.warn('Invalid authentication payload received:', { payload });
      throw new UnauthorizedException('Invalid authentication payload.');
    }

    this.logger.info(
      `Authentication payload validated successfully for user ID: ${payload.id}`,
    );
    return payload;
  }
}
