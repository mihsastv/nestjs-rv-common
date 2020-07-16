export enum PermissionType {
  READ = 'read',
  WRITE = 'write',
  NONE = 'none',
}

export enum PermissionScopedType {
  ALL = 'all',
  PARTIAL = 'partial',
  NONE = 'none',
}

export interface AssetsPermissionType {
  add: Exclude<PermissionScopedType, PermissionScopedType.PARTIAL>;
  delete: PermissionScopedType;
  read: PermissionScopedType;
  write: PermissionScopedType;
}

export interface AssetsPermissions {
  // пользовательские активы
  [key: string]: AssetsPermissionType;

  asset_groups: AssetsPermissionType;
  devices: AssetsPermissionType;
  domains: AssetsPermissionType;
  information: AssetsPermissionType;
  networks: AssetsPermissionType;
  offices: AssetsPermissionType;
  organization: AssetsPermissionType;
  processes: AssetsPermissionType;
  software: AssetsPermissionType;
  users: AssetsPermissionType;
  vulnerabilities: AssetsPermissionType;
}

export interface Permissions {
  assets?: AssetsPermissions;
  audit?: {
    checks: PermissionType;
    evaluations: PermissionType;
    remarks: PermissionType;
    remediation_plans: PermissionType;
  };
  general?: any;
  incidents?: any;
  risks?: {
    assessments: PermissionType;
    risk_map: PermissionType;
    security_framework: PermissionType;
  };
}

export interface RoleAccessPermission {
  add: boolean;
  delete: boolean;
  read: boolean;
  write: boolean;
}

export interface Role {
  access_rules: {
    assets: {
      additional_functions: any;
      asset_groups_types: any;
      mode?: string;
      permissions?: RoleAccessPermission;
    };
    audit: any;
    general: any;
    incidents: any;
    risks: any;
  };
  asset_groups_types: any;
  conditions: any;
  filters?: any[];
  id: number;
  type: any;
}
