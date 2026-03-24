import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSamples, createSample, deleteSample } from "@/api/samples";

export function useSamples() {
  return useInfiniteQuery({
    queryKey: ["samples"],
    queryFn: ({ pageParam = 0 }) => fetchSamples(pageParam),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length : undefined,
    initialPageParam: 0,
  });
}

export function useCreateSample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSample,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["samples"] }),
  });
}

export function useDeleteSample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSample,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["samples"] }),
  });
}
