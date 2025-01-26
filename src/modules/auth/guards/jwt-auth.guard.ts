import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.isRoutePublic(context);
    if (isPublic) {
      console.debug('Public route accessed');
      return true;
    }

    try {
      return super.canActivate(context) as Promise<boolean>;
    } catch (error) {
      throw new UnauthorizedException(
        'Authentication failed. Please log in again.',
      );
    }
  }

  private isRoutePublic(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false
    );
  }
}
