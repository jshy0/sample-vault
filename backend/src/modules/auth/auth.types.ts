export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export type SafeUser = Omit<User, "passwordHash">;

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}
