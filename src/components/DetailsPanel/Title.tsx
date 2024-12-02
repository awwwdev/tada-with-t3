"use client";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import useAutosizeTextArea from "@/hooks/useAutoSizeTextArea";
import QUERY_KEYS from "@/react-query/queryKeys";
import { Task } from "@/types";
import fetchAPI from "@/utils/fetchAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "@uidotdev/usehooks";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function Title({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    setValue(task.label ?? "");
  }, [task.label]);

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedValue) {
      taskMutation.mutate({ id: task.id, label: debouncedValue });
    }
  }, [debouncedValue]);

  // const [showEdit, setShowEdit] = useState(false);

  const taskMutation = useMutation({
    mutationFn: async ({ id, label }: { id: string; label: string }) => fetchAPI.PATCH(`/tasks/${id}`, { label }),
    onError: (err) => {
      toast.error("Error: " + err.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      // setShowEdit(false);
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textareaRef.current, value);

  const [showSavedIcon, setShowSavedIcon] = useState(false);

  useEffect(() => {
    if (taskMutation.isSuccess) {
      setShowSavedIcon(true);
      setTimeout(() => {
        setShowSavedIcon(false);
      }, 2000);
    }
  }, [taskMutation.isSuccess]);
  return (
    <div className="flex gap-3 grow">
      <form
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   taskMutation.mutate({ id: task.id, label: value });
        //   // setShowEdit(false);
        // }}
        className="flex gap-3 grow"
      >
        <div className="flex gap-2 items-center px-1.5 rd-1.5 bg-base1  focus-within:bg-base3 w-full">
          <textarea
            name="label"
            ref={textareaRef}
            value={value}
            // defaultValue={task.label}
            onChange={(e) => {
              setValue(e.target.value);
              // setShowEdit(true);
            }}
            className={`H2 
            focus:outline-none 
            bg-transparent
             b-transparent b-1  w-full overflow-hidden resize-none `}
            // disabled={!showEdit}
            rows={1}
            // autoFocus
          ></textarea>
          {taskMutation.isPending && (
            <div className="flex gap-1">
              <LoadingSpinner />
              <span className="italic">Saving</span>
            </div>
          )}
          {taskMutation.isSuccess && (
            <div className={`${showSavedIcon ? "opacity-100" : "opacity-0"} transition-opacity duration-300 flex gap-1`}>
              <Icon name="bf-i-ph-check-circle" className="c-green11" />
              <span className="c-green11">Saved</span>
            </div>
          )}
        </div>
        {/* {showEdit ? (
            <Button variant="solid" type="submit" isLoading={taskMutation.isPending}>
              Save
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                setShowEdit(true);
                if (textareaRef.current) {
                  textareaRef.current?.focus();
                }
              }}
              iconButton
              className="mis-auto shrink-0"
            >
              <Icon name="bf-i-ph-pencil-simple" className="c-base11" />
              <span className="sr-only">Edit</span>
            </Button>
          )} */}
      </form>
    </div>
  );
}
