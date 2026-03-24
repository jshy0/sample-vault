import { apiClient } from "./client";
import type { Sample } from "@/types/sample";

const PAGE_SIZE = 20;

export async function fetchSamples(page: number): Promise<Sample[]> {
  const { data } = await apiClient.get<Sample[]>("/samples", {
    params: { limit: PAGE_SIZE, offset: page * PAGE_SIZE },
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
