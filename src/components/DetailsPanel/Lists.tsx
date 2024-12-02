"use client";

import useTaskMutation from "@/hooks/useTaskMutation";
import useUserMe from "@/hooks/useUserMe";
import QUERY_KEYS from "@/react-query/queryKeys";
import { List, ListTask, Task } from "@/types";
import fetchAPI from "@/utils/fetchAPI";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import MenuItem from "../ui/MenuItem/MenuItem";
import toast from "react-hot-toast";
import Icon from "../ui/Icon";

type ListWithListTasks = List & { tasks: ListTask[] };
export default function Lists({ task }: { task: Task }) {
  const userMeQ = useUserMe();

  const listsQ = useQuery<ListWithListTasks[]>({
    queryKey: [QUERY_KEYS.LISTS],
    queryFn: () => fetchAPI.GET(`/lists`),
    enabled: !!userMeQ.data?.id,
  });

  const lists = listsQ.data;
  // const listWithThisTask = useMemo(() => {
  //   if (!listsQ.data) return [];
  //   return listsQ.data.filter((l: List) => {
  //     return l.tasks?.some((t: { id: string }) => t.id === task.id);
  //   });
  // }, [listsQ.data, task]);

  const [showEdit, setShowEdit] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // const taskMutation = useTaskMutation();

  const addTaskToListMutation = useMutation({
    mutationFn: async ({ listId, taskId, orderInList }: { listId: string; taskId: string; orderInList: string }) =>
      fetchAPI.POST(`/lists/${listId}/add-task/`, { taskId, orderInList, listId }),
    onError: (err) => {
      toast.error("Error: " + err.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
    },
  });

  const removeTaskFromListMutation = useMutation({
    mutationFn: async ({ listId, taskId }: { listId: string; taskId: string }) =>
      fetchAPI.DELETE(`/lists/${listId}/remove-task/${taskId}`),
    onError: (err) => {
      toast.error("Error: " + err.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
    },
  });

  const [parentRef, enableAnimations] = useAutoAnimate(/* optional config */);

  const isInNoList = !listsQ.data?.some((l) => l.tasks.some((listTask: ListTask) => listTask.taskId === task.id)); //TODO implement this

  return (
    <div className=" ">
      <div className="h-3"></div>
      <div>
        <ul className="" ref={parentRef}>
          <fieldset>
            <div className="flex gap-3 flex-wrap ">
              <legend className="H2 mie-auto">List</legend>
              {/* <InputItem
                index={-1}
                label="No List"
                value="INVALID_LIST_ID"
                checked={isInNoList}
                onChange={(e) => {
                  taskMutation.mutate({
                    id: task.id,
                    listId: null,
                  });
                }}
              /> */}

              {lists &&
                lists.length > 0 &&
                lists.map((list: ListWithListTasks, index: number) => {
                  const isInList = list.tasks.some((listTask: ListTask) => listTask.taskId === task.id); //TODO implement this
                  const maxOrderInList = Math.max(...list.tasks.map((listTask) => Number(listTask.orderInList))); //TODO implement this
                  return (
                    <InputItem
                      key={`list-input-item-${index}`}
                      index={index}
                      label={list.name}
                      value={list.id}
                      checked={isInList}
                      onChange={(e) => {
                        if (isInList) {
                          removeTaskFromListMutation.mutate({
                            listId: list.id,
                            taskId: task.id,
                          });
                        } else {
                          addTaskToListMutation.mutate({
                            listId: list.id,
                            taskId: task.id,
                            orderInList: String(maxOrderInList + 1),
                          });
                        }
                      }}
                    />
                  );
                })}
            </div>
          </fieldset>
        </ul>
      </div>
    </div>
  );
}

function InputItem({
  index,
  label,
  value,
  checked,
  onChange,
}: {
  index: number;
  label: string;
  value: string;
  checked: boolean;
  onChange: (e: any) => void;
}) {
  return (
    <label htmlFor={`list-radio-item-${index}`} key={`list-item-${index}`}>
      <MenuItem className="flex gap-3 " size="lg" variant="soft">
        <div className="w-5 h-5 bg-base2 rd-1 flex justify-center items-center">
          {/* {checked && <div className="w-3 h-3 bg-accent11 rd-2"></div>} */}
          {checked && <Icon name="bf-i-ph-check" />}
        </div>
        <span>{label}</span>
        <input
          value={value}
          type="checkbox"
          name="list-radio-group"
          id={`list-radio-item-${index}`}
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
      </MenuItem>
    </label>
  );
}
