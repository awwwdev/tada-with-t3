import type { List, ListTask, Task } from "../types";
import fetchAPI from "../utils/fetchAPI";
import { useQuery } from "@tanstack/react-query";
type ListTaskWithTask = ListTask & { task: Task };
type ListWithTasks = List & { tasks: ListTaskWithTask[] };

export default function useList({ listId }: { listId: string }) {
  return useQuery<ListWithTasks>({
    queryKey: ["tasks", "lists", listId],
    queryFn: () => fetchAPI.GET(`/lists/${listId}`),
    enabled: !!listId,
  });
}