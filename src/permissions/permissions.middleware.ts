import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import Hemera from 'nats-hemera';
import { Permissions, Role } from './permissions.interface';

interface UserProfile {
  fio: string;
  id: number;
  login: string;
  roles: Role[];
}

@Injectable()
export class AuthorizeMiddleware implements NestMiddleware {
  constructor(@Inject('Hemera') private readonly hemera: Hemera<{}, {}>) {}

  async use(req: Request, _res: Response, next: Function) {
    const userId = req.userId;

    if (userId) {
      req.permissions = await this.getUserPermissions(userId);
    }

    next();
  }

  async getUserPermissions(userId: number): Promise<Permissions> {
    const profile = await this.getProfile(userId);
    return this.getPermissions(profile.roles);
  }

  async getPermissions(roles: Role[]): Promise<Permissions> {
    const { data: permissions } = await this.hemera.act<Permissions>({
      cmd: 'system-users:permissions:get',
      payload: {
        roles,
      },
      timeout$: 60 * 1000,
      topic: 'sysusers',
    });

    return permissions;
  }

  private async getProfile(userId: number): Promise<UserProfile> {
    const { data: profile } = await this.hemera.act<UserProfile>({
      cmd: 'system-users:profile:get',
      payload: {
        userId,
      },
      timeout$: 60 * 1000,
      topic: 'sysusers',
    });

    return profile;
  }
}
