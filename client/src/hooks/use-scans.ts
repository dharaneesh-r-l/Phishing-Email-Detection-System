import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type AnalyzeRequest, type AnalyzeResponse } from "@shared/routes";

export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scan history");
      return api.scans.list.responses[200].parse(await res.json());
    },
  });
}

export function useAnalyzeEmail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      const validated = api.scans.analyze.input.parse(data);
      const res = await fetch(api.scans.analyze.path, {
        method: api.scans.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 500) {
          const error = api.scans.analyze.responses[500].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Analysis failed");
      }
      
      return api.scans.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate list to show new scan in history
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
    },
  });
}
