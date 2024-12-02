"use client";

import useList from "@/hooks/useList";
import useUserMe from "@/hooks/useUserMe";
import QUERY_KEYS from "@/react-query/queryKeys";
import { SMART_LIST_IDS } from "@/schema/smartListTask.model";
import fetchAPI from "@/utils/fetchAPI";
// import { NewTask } from "@tada/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import { useGlobalContext } from "./Provider";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { createClientForBrowser } from "@/utils/supabase/client";


export default function TaskInput() {
  const queryClient = useQueryClient();
  const [draft, setDraft, removeValue] = useLocalStorage<any>("draft-task", {
    label: "",
    status: "to-do",
    authorId: "",
  });
  const userMeQ = useUserMe();
  const {  setShowAuthModal } = useGlobalContext();
  const params = useParams<{ listId: string }>();

  const listId = params.listId;
  const isSmartList = Object.values(SMART_LIST_IDS).some(item => item === listId);
  // const tasksQ = useTasks({ listId: currentList.type === "user-list" ? currentList.id : "" });
  const listQ = useList({ listId });

  const smartListTasks = useQuery({
    queryKey: ["smart-list-tasks"],
    queryFn: () => fetchAPI.GET(`/tasks?smartListId=${listId}`),
    enabled: !!listId && !isSmartList,
  })

  const supabase = createClientForBrowser();

  const addTaskM = useMutation({
    mutationFn: async (task: NewTask) => {
      let maxOrderInList = 0;
      if (listId !== "" && listQ.data) {
        maxOrderInList = Math.max(...listQ.data?.tasks.map((listTask) => Number(listTask.orderInList)));
      }
      // return fetchAPI.POST(`/tasks${isSmartList ? `?smartListId=${listId}` : `?listId=${listId}`}`, {
      //   task: {
      //     ...task,
      //     authorId: userMeQ.data?.id,
      //   },
      //   orderInList: String(maxOrderInList + 1),
      // });

      const {data: insertedTask , error } = await supabase.from("task").insert({ ...task , authorId: userMeQ.data?.id, orderInList: String(maxOrderInList + 1) });

      const {data: insertedTaskList , error: error2r } = await supabase.from("list_task").insert({ taskId: insertedTask.id, listId: listId, order_in_list: String(maxOrderInList + 1) });
    },
    onError: (err: Error) => {
      toast.error("Error: " + err.message);
    },
    onSuccess: () => {
      setDraft({
        label: "",
        status: "to-do",
        authorId: "",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
    },
    onSettled: () => {
      if (inputRef.current) inputRef.current.focus();
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <div className="bottom-100% h-6 bg-gradient-to-t from-base3 to-transparent  absolute w-full z-10"></div>
      <div className="h-2 bg-base3"></div>
      <form
        className="mt-auto px-2"
        onSubmit={(e) => {
          if (!userMeQ.data) {
            setShowAuthModal(true);
            return;
          }
          e.preventDefault();
          addTaskM.mutate(draft);
        }}
      >
        <div className="flex gap-3 items-end px-3">
          <div className="grow">
            <Input
              ref={inputRef}
              name="new-task"
              label=""
              type="text"
              value={draft.label}
              onChange={(e) => setDraft((s) => ({ ...s, label: e.target.value }))}
            />
          </div>
          <Button
            variant="solid"
            type={userMeQ.data ? "submit" : "button"}
            isLoading={addTaskM.isPending}
            onClick={() => {
              if (!userMeQ.data) {
                setShowAuthModal(true);
              }
            }}
          >
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
}
