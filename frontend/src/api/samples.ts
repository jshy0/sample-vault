import { apiClient } from "./client";
import type { Sample } from "@/types/sample";

const PAGE_SIZE = 20;

export interface SearchParams {
  q?: string;
  bpm_min?: number;
  bpm_max?: number;
  key?: string;
  mode?: string;
  tags?: string[];
}

export async function fetchSamples(page: number): Promise<Sample[]> {
  const { data } = await apiClient.get<Sample[]>("/samples", {
    params: { limit: PAGE_SIZE, offset: page * PAGE_SIZE },
  });
  return data;
}

export async function searchSamples(params: SearchParams): Promise<Sample[]> {
  const { data } = await apiClient.get<Sample[]>("/samples", {
    params: { ...params, limit: PAGE_SIZE, offset: 0 },
  });
  return data;
}

export async function createSample(formData: FormData): Promise<Sample> {
  const { data } = await apiClient.post<Sample>("/samples", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteSample(id: string): Promise<void> {
  await apiClient.delete(`/samples/${id}`);
}
