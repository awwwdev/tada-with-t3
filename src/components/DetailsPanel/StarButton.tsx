import useTaskMutation from "@/hooks/useTaskMutation";
import { Task } from "@/types";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

export default function StarButton({ task }: { task: Task }) {
  const taskMutation = useTaskMutation();

  return (
    <Button
      variant="ghost"
      iconButton
      onClick={() => {
        taskMutation.mutate({ id: task.id, starred: !task.starred });
      }}
    >
      <Icon name={task.starred ? "bf-i-ph-star-fill" : "bf-i-ph-star"} className={task.starred ? "c-accent11" : "c-base11"  } />
      <span className="sr-only">Star</span>
    </Button>
  );
}
