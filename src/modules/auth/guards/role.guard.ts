import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WinstonLoggerService } from 'src/core/utils/logger';
import { RoleService } from 'src/modules/role/role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
    private readonly logger: WinstonLoggerService,
  ) {}

  private async getUserRole(
    userId: number,
    projectId?: number,
  ): Promise<string | null> {
    this.logger.info('Fetching user role', { userId, projectId });
    if (projectId) {
      const role = await this.roleService.findRoleNameByUserAndProject(
        userId,
        projectId,
      );
      this.logger.info('Role found for user in project', {
        userId,
        projectId,
        role,
      });

      return role;
    }
    const globalRole = await this.roleService.findRoleByUser(userId);
    this.logger.info('Global role found for user', {
      userId,
      role: globalRole,
    });
    return globalRole;
  }

  private isUserRoleAuthorized(
    requiredRoles: string[],
    userRole: string,
  ): boolean {
    const isAuthorized = requiredRoles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase(),
    );
    this.logger.debug('Role authorization check', {
      requiredRoles,
      userRole,
      isAuthorized,
    });
    return isAuthorized;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      this.logger.info('No roles required for this route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user, projectId } = request;

    if (!user) {
      this.logger.warn('Unauthorized access attempt', { projectId });
      throw new ForbiddenException('User is not authenticated.');
    }

    try {
      this.logger.info('Validating user role', { userId: user.id, projectId });
      const userRole = await this.getUserRole(user.id, projectId);

      if (!userRole) {
        this.logger.warn('User role not found', { userId: user.id, projectId });
        throw new ForbiddenException('User role could not be determined.');
      }

      const isAuthorized = this.isUserRoleAuthorized(requiredRoles, userRole);
      if (!isAuthorized) {
        this.logger.warn('User does not have required role', {
          userId: user.id,
          requiredRoles,
          userRole,
        });
        throw new ForbiddenException(
          'You do not have the required permissions to access this resource.',
        );
      }

      this.logger.info('Access granted', {
        userId: user.id,
        projectId,
        userRole,
      });

      return true;
    } catch (error) {
      this.logger.error('Authorization failed', {
        userId: user?.id,
        error: error.message,
      });
      throw new ForbiddenException(error.message || 'Authorization failed.');
    }
  }
}
