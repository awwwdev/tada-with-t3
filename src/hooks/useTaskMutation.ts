import QUERY_KEYS from "@/react-query/queryKeys";
import { TaskFields } from "@/types";
import fetchAPI from "@/utils/fetchAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TaskFields> & { id: string }) => {
      return fetchAPI.PATCH(`/tasks/${id}`, { ...updates, id: undefined });
    },
    onError: (err) => {
      toast.error("Error: " + err.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
    },
  });
}
