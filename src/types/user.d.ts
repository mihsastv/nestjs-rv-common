declare namespace Express {
  export interface Request {
    userId?: number;
    user?: import('../auth/profile.interface').UserProfile;
    permissions?: import('../auth/permissions.interface').Permissions;
  }
}
