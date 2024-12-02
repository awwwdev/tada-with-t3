import QUERY_KEYS from '@/react-query/queryKeys';
import { Task } from '@/types';
import fetchAPI from '@/utils/fetchAPI';
import { useQuery } from '@tanstack/react-query';

type Args = {
  select?: (data: Task[]) => Task[]
  listId?: string
} | undefined;

export default function useTasks(args?: Args) {
  const { select, listId } = args || {};
  return useQuery<Task[], Error, Task[]>({
    queryKey: listId ? ['tasks', listId] : ['tasks'],
    queryFn: () => fetchAPI.GET(`/tasks${listId ? `?listId=${listId}` : ''}`),
    select: select ? (data: Task[]) => select(data) : undefined
  });
}