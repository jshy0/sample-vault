import { randomUUID } from "crypto";
import { pool } from "../../db";
import { CreateSampleDTO } from "./samples.schema";
import { Sample } from "./samples.types";

export const SamplesRepository = {
  async findAll(): Promise<Sample[]> {
    const result = await pool.query(
      `SELECT s.id, s.name, s.bpm, s.key, s.tags, s.file_url, s.created_at, u.username
       FROM samples s
       JOIN users u ON u.id = s.user_id
       ORDER BY s.created_at DESC`,
    );
    return result.rows;
  },

  async findById(id: string, userId: string): Promise<Sample | null> {
    const result = await pool.query(
      "SELECT * FROM samples WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    return result.rows[0] ?? null;
  },

  async create(
    userId: string,
    data: CreateSampleDTO,
    fileUrl: string,
  ): Promise<Sample> {
    const result = await pool.query(
      `INSERT INTO samples (id, user_id, name, bpm, key, tags, file_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [randomUUID(), userId, data.name, data.bpm, data.key, data.tags, fileUrl],
    );
    return result.rows[0];
  },

  async delete(id: string, userId: string): Promise<void> {
    await pool.query("DELETE FROM samples WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);
  },
};
