import { randomUUID } from "crypto";
import { pool } from "../../db";
import { CreateSampleDTO } from "./samples.schema";
import { Sample } from "./samples.types";

export const SamplesRepository = {
  async findAll(userId: string): Promise<Sample[]> {
    const result = await pool.query(
      `SELECT s.*, u.username
       FROM samples s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [userId],
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
