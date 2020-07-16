import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { HemeraModule } from '../hemera/hemera.module';
export { PermissionsService } from './permissions.service';
export { PermissionType, PermissionScopedType } from './permissions.interface';

@Module({
  exports: [PermissionsService],
  imports: [HemeraModule],
  providers: [PermissionsService],
})
export class PermissionsModule {}
