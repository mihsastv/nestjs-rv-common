import { Injectable } from '@nestjs/common';
import * as Hemera from 'nats-hemera';
import { Role, Permissions } from './permissions.interface';

interface UserProfile {
  fio: string;
  id: number;
  login: string;
  roles: Role[];
}

@Injectable()
export class PermissionsService {
  constructor(
    private readonly hemera: Hemera<{}, {}>,
  ) {}

  async getUserPermissions(
    userId: number,
  ): Promise<Permissions> {
    {
      const profile = await this.getProfile(userId);
      return this.getPermissions(profile.roles);
    }
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
