import { useGlobalContext } from '@/components/Provider';
import QUERY_KEYS from '@/react-query/queryKeys';
import { Task } from '@/types';
import fetchAPI from '@/utils/fetchAPI';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import useUserMe from './useUserMe';

export default function useSelectedTask() {
  const userMeQ = useUserMe();
  const { selectedTaskId } = useGlobalContext();
  const allTasksQ = useQuery({
    queryKey: [QUERY_KEYS.TASKS],
    queryFn: async () => fetchAPI.GET(`/tasks`),
  });

  const selectedTask = useMemo(
    () => {
      if (!allTasksQ.data) return null;
      return allTasksQ.data?.find((t: Task) => t.id === selectedTaskId)
    },
    [allTasksQ.data, selectedTaskId, userMeQ.data?.id]
  );

  return selectedTask
}