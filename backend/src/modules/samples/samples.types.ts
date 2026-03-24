export interface Sample {
  id: string;
  user_id: string;
  name: string;
  bpm: number;
  key: string;
  tags: string[];
  file_url: string;
  created_at: Date;
}
