import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators';
import { WinstonLoggerService } from 'src/core/utils/logger';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: WinstonLoggerService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const isPublic = this.isRoutePublic(context);
    if (isPublic) {
      this.logger.info('Public route accessed', { method, url });
      return true;
    }

    try {
      this.logger.info('Authenticating request', { method, url });
      const result = (await super.canActivate(context)) as boolean;
      this.logger.info('Authentication successful', { method, url });

      return result;
    } catch (error) {
      this.logger.error('Authentication failed', {
        method,
        url,
        error: error.message,
      });
      throw new UnauthorizedException(
        'Authentication failed. Please log in again.',
      );
    }
  }

  private isRoutePublic(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.logger.debug('Checked if route is public', { isPublic });

    return isPublic || false;
  }
}
