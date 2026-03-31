export interface Sample {
  id: string;
  username: string;
  name: string;
  bpm: number | null;
  key: string | null;
  mode: string | null;
  tags: string[];
  file_url: string;
  created_at: Date;
}
