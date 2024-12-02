"use client";

import { SmartListId, Task } from "@/types";
import fetchAPI from "@/utils/fetchAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import List from "../List";

export default function SmartList({ listId, tasks }: { listId: SmartListId , tasks: Task[] }) {
  const tasksQ = useQuery<Task[]>({
    queryKey: ["tasks"], // TODO add query key per list and send filters to api
    queryFn: () => fetchAPI.GET(`/tasks`),
    select: (data: Task[]) => smartListSelect[listId](data),
  });
  const queryClient = useQueryClient();
  return (
    <List
      tasks={tasks}
      // setTasks={(data) => queryClient.setQueryData(["tasks"], data)}
      listName={<span className="capitalize">{listId.replaceAll("_", " ").toLowerCase()}</span>}
    />
  );
}

const smartListSelect: Record<SmartListId, (data: Task[]) => Task[]> = {
  ALL_TASKS: (data: Task[]) => data.filter((t: Task) => t),
  DO_TODAY: (data: Task[]) => data.filter((t: Task) => t),
  DO_TOMORROW: (data: Task[]) => data.filter((t: Task) => t),
  DO_LATER: (data: Task[]) => data.filter((t: Task) => t),
  NEXT_WEEK: (data: Task[]) => data.filter((t: Task) => t),
  ASSIGNED: (data: Task[]) => data.filter((t: Task) => t),
  ASSIGNED_TO_ME: (data: Task[]) => data.filter((t: Task) => !t.deleted),
  WITH_REMINDERS: (data: Task[]) => data.filter((t: Task) => t.reminders && t.reminders?.length > 0),
  ROUTINES: (data: Task[]) => data.filter((t: Task) => t.routines && t.routines?.length > 0),
  ARCHIVED: (data: Task[]) => data.filter((t: Task) => t.archived),
  DELETED: (data: Task[]) => data.filter((t: Task) => t.deleted),
  STARRED: (data: Task[]) => data.filter((t: Task) => t.starred),
  PINNED: (data: Task[]) => data.filter((t: Task) => t.pinned),
  WITH_DUE_DATES: (data: Task[]) => data.filter((t: Task) => t.dueAt),
};
