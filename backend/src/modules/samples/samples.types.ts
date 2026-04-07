export interface Sample {
  id: string;
  userId?: string;
  username: string;
  name: string;
  bpm: number | null;
  key: string | null;
  mode: string | null;
  tags: string[];
  fileUrl: string;
  createdAt: Date;
}
