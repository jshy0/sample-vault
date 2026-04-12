import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { s3, S3_BUCKET } from "../config/s3.js";

export const StorageService = {
  async upload(file: Express.Multer.File, userId: string): Promise<string> {
    const key = `samples/${userId}/${randomUUID()}.wav`;

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: "audio/wav",
      }),
    );

    return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  },

  async delete(fileUrl: string): Promise<void> {
    const key = new URL(fileUrl).pathname.slice(1);

    await s3.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      }),
    );
  },

  async getPresignedUrl(fileUrl: string): Promise<string> {
    const key = new URL(fileUrl).pathname.slice(1);
    return getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
      { expiresIn: 60 },
    );
  },
};
