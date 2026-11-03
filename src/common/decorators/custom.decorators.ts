import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 10. Custom Decorator: Gán metadata danh sách Roles yêu cầu cho endpoint
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * 10. Custom Decorator: Trích xuất thông tin User từ Request Object
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user || {
      id: 1,
      username: 'nhat_dev',
      role: request.headers['x-user-role'] || 'admin',
    };

    return data ? user?.[data] : user;
  },
);

