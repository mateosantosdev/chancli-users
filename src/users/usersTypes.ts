export enum UserRoles {
  ADMIN = 'ADMIN',
  NORMAL = 'NORMAL'
}
export interface UserSession {
  id: string;
  email: string;
  role?: UserRoles;
  created_at?: string;
  updated_at?: string;
};

export interface UserUpdateParams {
  id: string;
  email?: string;
  password?: string;
}