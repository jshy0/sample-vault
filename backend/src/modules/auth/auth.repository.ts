import { pool } from "../../db";
import { User } from "./auth.types";

export const AuthRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] ?? null;
  },

  async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0] ?? null;
  },

  async create(
    id: string,
    email: string,
    username: string,
    passwordHash: string,
  ): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (id, email, username, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, email, username, passwordHash],
    );
    return result.rows[0];
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },
};
