declare namespace Express {
  export interface Request {
    userId?: number;
    permissions?: import('../permissions/permissions.interface').Permissions;
  }
}
