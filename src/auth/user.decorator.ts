import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from './profile.interface';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserProfile => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
