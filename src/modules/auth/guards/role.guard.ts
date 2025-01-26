import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/modules/role/role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  private async getUserRole(
    userId: number,
    productId?: number,
  ): Promise<string | null> {
    if (productId) {
      return this.roleService.findRoleNameByUserAndProject(userId, productId);
    }
    return this.roleService.findRoleByUser(userId);
  }

  private isUserRoleAuthorized(
    requiredRoles: string[],
    userRole: string,
  ): boolean {
    return requiredRoles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase(),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user, projectId } = request;

    if (!user) {
      throw new ForbiddenException('User is not authenticated.');
    }

    try {
      const userRole = await this.getUserRole(user.id, projectId);
      if (!userRole) {
        throw new ForbiddenException('User role could not be determined.');
      }

      const isAuthorized = this.isUserRoleAuthorized(requiredRoles, userRole);
      if (!isAuthorized) {
        throw new ForbiddenException(
          'You do not have the required permissions to access this resource.',
        );
      }

      return true;
    } catch (error) {
      throw new ForbiddenException(error.message || 'Authorization failed.');
    }
  }
}
