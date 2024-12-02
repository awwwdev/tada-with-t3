import fetchAPI from "@/utils/fetchAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => fetchAPI.DELETE(`/lists/${id}`),
    onError: (err: Error) => toast.error("Error: " + err.message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists"] }),
  });
}
