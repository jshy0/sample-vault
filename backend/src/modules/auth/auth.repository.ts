import { pool } from "../../db";
import { User } from "./auth.types";

export const AuthRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] ?? null;
  },

  async create(id: string, email: string, passwordHash: string): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, email, passwordHash],
    );
    return result.rows[0];
  },
};
