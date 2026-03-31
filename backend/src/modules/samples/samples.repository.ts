import { randomUUID } from "crypto";
import { pool } from "../../db";
import { CreateSampleDTO, SearchQueryDTO } from "./samples.schema";
import { Sample } from "./samples.types";

export const SamplesRepository = {
  async findAll(): Promise<Sample[]> {
    const result = await pool.query(
      `SELECT s.id, s.name, s.bpm, s.key, s.mode, s.tags, s.file_url, s.created_at, u.username
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
      `INSERT INTO samples (id, user_id, name, bpm, key, mode, tags, file_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        randomUUID(),
        userId,
        data.name,
        data.bpm,
        data.key,
        data.mode,
        data.tags,
        fileUrl,
      ],
    );
    return result.rows[0];
  },

  async delete(id: string, userId: string): Promise<void> {
    await pool.query("DELETE FROM samples WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);
  },

  async search(params: SearchQueryDTO): Promise<Sample[]> {
    const result = await pool.query(
      `
      SELECT s.id, s.name, s.bpm, s.key, s.mode, s.tags, s.file_url, s.created_at, u.username
      FROM samples s
      JOIN users u on u.id = s.user_id
      WHERE ($1::text IS NULL or s.name ILIKE '%' || $1 || '%')
        AND ($2::int IS NULL or s.bpm >= $2)
        AND ($3::int IS NULL or s.bpm <= $3)
        AND ($4::text IS NULL or s.key = $4)
        AND ($5::text IS NULL or s.mode = $5)
        ORDER BY s.created_at DESC
      `,
      [
        params.q ?? null,
        params.bpm_min ?? null,
        params.bpm_max ?? null,
        params.key ?? null,
        params.mode ?? null,
      ],
    );
    return result.rows;
  },
};
