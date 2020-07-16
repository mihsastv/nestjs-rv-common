import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { HemeraModule } from '../hemera/hemera.module';
export { PermissionsService } from './permissions.service';
export {
  PermissionType,
  PermissionScopedType,
  AssetsPermissions,
  AssetsPermissionType,
  Permissions as UserPermissions,
} from './permissions.interface';
export { Permissions } from './permissions.decorator';
export { PermissionsMiddleware } from './permissions.middleware';

@Module({
  exports: [PermissionsService],
  imports: [HemeraModule],
  providers: [PermissionsService],
})
export class PermissionsModule {}
