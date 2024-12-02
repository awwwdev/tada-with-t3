import QUERY_KEYS from "@/react-query/queryKeys";
import { ListFields } from "@/types";
import fetchAPI from "@/utils/fetchAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useListMutation({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ListFields> & { id: string }) =>
      fetchAPI.PATCH(`/lists/${id}`, { ...updates, id: undefined, _id: undefined }),
    onError: (err: Error) => {
      toast.error("Error: " + err.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
      onSuccess?.();
    },
  });
}
