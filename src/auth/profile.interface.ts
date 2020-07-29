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

export interface UserProfile {
  fio: string;
  id: number;
  login: string;
  roles: Role[];
  companies_id: number[];
  tz: string;
  all_companies: boolean;
}
