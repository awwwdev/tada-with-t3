import useTasks from '@/hooks/useTasks';
import QUERY_KEYS from '@/react-query/queryKeys';
import { Task } from '@/types';
import fetchAPI from '@/utils/fetchAPI';
import { useQuery } from '@tanstack/react-query';

export default function StarredList() {

  const tasksQ = useTasks({select: (data: Task[]) => data.filter((t: Task) => t.starred)});

  return (<div>
    <h3>Starred List</h3>

  </div>);
}
