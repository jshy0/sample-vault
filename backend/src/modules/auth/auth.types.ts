export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
}

export type SafeUser = Omit<User, "password_hash">;

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}
