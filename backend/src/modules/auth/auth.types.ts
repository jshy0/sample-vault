export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}
