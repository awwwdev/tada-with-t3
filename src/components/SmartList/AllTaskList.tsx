"use client";

import { useQueryClient } from "@tanstack/react-query";
import List from "../List";
import useTasks from "@/hooks/useTasks";

export default function AllTasksList() {
  const allTasksQ = useTasks();
  const queryClient = useQueryClient();
  return (
    <List
      tasks={allTasksQ.data ?? []}
      setTasks={(data) => {
        queryClient.setQueryData(["tasks"], data);
      }}
      listName={"All Tasks"}
    />
  );
}
