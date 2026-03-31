import { searchSamples, type SearchParams } from "@/api/samples";
import { useQuery } from "@tanstack/react-query";

export function useSearchResults(params: SearchParams) {
  return useQuery({
    queryKey: ["samples", "search", params],
    queryFn: () => searchSamples(params),
  });
}
