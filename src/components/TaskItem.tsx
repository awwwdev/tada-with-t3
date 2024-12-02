"use client";

import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Icon from "@/components/ui/Icon";
import useBreakPoint from "@/hooks/useBreakPoint";
import useTaskMutation from "@/hooks/useTaskMutation";
import useUserMe from "@/hooks/useUserMe";
import { Task } from "@/types";
import fetchAPI from "@/utils/fetchAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useGlobalContext } from "./Provider";
import DesktopOnly from "./ui/DesktopOnly";
import MobileOnly from "./ui/MobileOnly";
// import { motion } from "framer-motion";
export default function TaskItem({
  task,
  // draggable,
  // onDragStart,
  // onDragEnd,
  // onDragEnter,
  // onDragLeave,
  // onDragOver,
  // onDrop,
}: {
  task: Task;
  // draggable: boolean;
  // onDragStart: (e: React.DragEvent<HTMLLIElement>) => void;
  // onDragEnd: (e: React.DragEvent<HTMLLIElement>) => void;
  // onDragEnter: (e: React.DragEvent<HTMLLIElement>) => void;
  // onDragLeave: (e: React.DragEvent<HTMLLIElement>) => void;
  // onDragOver: (e: React.DragEvent<HTMLLIElement>) => void;
  // onDrop: (e: React.DragEvent<HTMLLIElement>) => void;
}) {
  const { setSelectedTaskId, selectedTaskId } = useGlobalContext();

  const taskMutation = useTaskMutation();
  const queryClient = useQueryClient();
  const userMeQ = useUserMe();

  const duplicateTaskMutation = useMutation<Task, Error, Task>({
    mutationFn: (copiedTask: Task) => {
      const { id, authorId, createdAt, updatedAt, ...values } = copiedTask;
      return fetchAPI.POST(`/tasks`, { ...values, authorId: userMeQ.data?.id });
    },
    onError: (err) => toast.error("Error: " + err.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div
      // layoutId={task.id}
      // layout
      className={`b-transparent b-1 rd-3 p-3 pis-6 flex items-center bg-base1 relative  group `}
      // draggable={draggable}
      // onDragStart={onDragStart}
      // onDragEnd={onDragEnd}
      // onDragEnter={onDragEnter}
      // onDragLeave={onDragLeave}
      // onDragOver={onDragOver}
      // onDrop={onDrop}
    >
      {selectedTaskId === task.id && <TraingleIndicator />}
      <Checkbox
        checked={task.status === "done"}
        onChange={(checked) => taskMutation.mutate({ id: task.id, status: task.status === "done" ? "to-do" : "done" })}
      />
      <SelectArea task={task} />
      <div className="mis-auto flex  hover:opacity-100 ">
        {/* <Button variant="text" iconButton onClick={() => setTask({ ...task, deleted: true })}>
          <Icon name="bf-i-ph-trash" className="c-base11" />
          <span className="sr-only">Delete</span>
        </Button> */}
        <DesktopOnly>
          <Button
            variant="text"
            className={`group-hover:visible invisible `}
            iconButton
            onClick={() => duplicateTaskMutation.mutate(task)}
          >
            <Icon name="bf-i-ph-copy" className="c-base11" />
            <span className="sr-only">Duplicate</span>
          </Button>
          <Button
            variant="text"
            className={`group-hover:visible ${task.pinned ? "visible" : "invisible"} `}
            iconButton
            onClick={() => taskMutation.mutate({ id: task.id, pinned: !task.pinned })}
          >
            {task.pinned ? (
              <Icon name="bf-i-ph-push-pin-fill" className="c-accent11" />
            ) : (
              <Icon name="bf-i-ph-push-pin" className="c-base11" />
            )}
            {task.pinned ? (
              <span className="sr-only">Un pin this task</span>
            ) : (
              <span className="sr-only">Pin this task</span>
            )}
          </Button>
          <Button
            variant="text"
            className={`group-hover:visible ${task.starred ? "visible" : "invisible"} `}
            iconButton
            onClick={() => taskMutation.mutate({ id: task.id, starred: !task.starred })}
          >
            {task.starred ? (
              <Icon name="bf-i-ph-star-fill" className="c-accent11" />
            ) : (
              <Icon name="bf-i-ph-star" className="c-base11" />
            )}
            {task.starred ? (
              <span className="sr-only">Un-star this task</span>
            ) : (
              <span className="sr-only">Star this task</span>
            )}
          </Button>
        </DesktopOnly>
        <div className={`cursor-move px-2 flex items-center`}>
          <Icon name="bf-i-ph-dots-six-vertical" />
        </div>
      </div>
    </div>
  );
}

function TraingleIndicator() {
  return (
    <div className="lt-sm:hidden absolute top-50% -translate-y-50% -right-[1.15rem] z-100 w-6 h-6 overflow-clip scale-y-80 scale-x-100">
      <div className="h-full w-full rotate-135deg rd-br-1.5 b-base7 b-1 bg-base1 translate-x-70%"></div>
    </div>
  );
}

function SelectArea({ task }: { task: Task }) {
  const { setSelectedTaskId, setDetailsPanelOpen } = useGlobalContext();
  const breakpoints = useBreakPoint();

  return (
    <button
      type="button"
      className=" grow cursor-default  h-10 self-stretch text-start flex items-center"
      onClick={() => {
        if (!breakpoints.sm) setDetailsPanelOpen(true);
        setSelectedTaskId(task.id);
      }}
    >
      <span className="mis-3">{task.label}</span>
      <span className="sr-only">Select This Task</span>
      <span className="mis-auto"></span>
      <MobileOnly>
        <span className="flex gap-6 items-center pie-3 ">
          {task.starred && <Icon name="bf-i-ph-star-fill" className="c-accent11" />}
          {task.pinned && <Icon name="bf-i-ph-push-pin-fill" className="c-accent11" />}
        </span>
      </MobileOnly>
    </button>
  );
}
