import useTaskMutation from "@/hooks/useTaskMutation";
import { Task } from "@/types";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

export default function PinButton({ task }: { task: Task }) {
  const taskMutation = useTaskMutation();

  return (
    <Button
      variant="ghost"
      iconButton
      onClick={() => {
        taskMutation.mutate({ id: task.id, pinned: !task.pinned });
      }}
    >
      <Icon name={task.pinned ? "bf-i-ph-push-pin-fill" : "bf-i-ph-push-pin"}  className={task.pinned ? "c-accent11" : "c-base11"  } />
      <span className="sr-only">Pin to the top of the list</span>
    </Button>
  );
}
