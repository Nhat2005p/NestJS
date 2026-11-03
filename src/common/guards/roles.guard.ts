import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/custom.decorators';

/**
 * 8. Guards: Kiểm tra quyền hạn truy cập dựa trên Roles metadata
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu endpoint không yêu cầu role nào, cho phép truy cập
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['x-auth-token'];

    // Giả lập kiểm tra Auth Token
    if (!authHeader) {
      throw new UnauthorizedException(
        'Yêu cầu header x-auth-token để xác thực truy cập.',
      );
    }

    const userRole = request.headers['x-user-role'] || 'admin';
    const hasRole = requiredRoles.includes(userRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Quyền hạn '${userRole}' không được phép thực hiện hành động này. Yêu cầu: [${requiredRoles.join(', ')}]`,
      );
    }

    // Gán user vào request để Custom Decorator có thể đọc được
    request.user = {
      id: 101,
      username: 'minhnhat_sun',
      role: userRole,
    };

    return true;
  }
}
