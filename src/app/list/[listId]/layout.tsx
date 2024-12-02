import SmartList from "@/components/SmartList";
import TaskInput from "@/components/TaskInput";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Icon from "@/components/ui/Icon";
import UserList from "@/components/UserList";
import { createDrizzleSupabaseClient } from "@/db/db";
import { LIST_TASK } from "@/schema/listTask.model";
import { SMART_LIST_IDS } from "@/schema/smartListTask.model";
import { Task, TASK } from "@/schema/task.model";
import { SmartListId } from "@/types";
import { createClientForServer } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { useEffect } from "react"
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ listId: string }>;
}) {
  const listId = (await params).listId;
  const db = await createDrizzleSupabaseClient();
  const supabase = createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isSmartList = Object.values(SMART_LIST_IDS).some((item) => item === listId);

  const listName = "ListName";
  let smartListTasks: Task[] = [];
  let userListTasks: Task[] = [];
  let userListName = "";
  // fetch list id
  if (user) {
    if (isSmartList) {
      smartListTasks = await db(async (tx) =>
        tx.query.TASK.findMany({
          where: eq(TASK.authorId, user?.id ?? ""),
        })
      );
    } else {
      const listTasks = await db(async (tx) =>
        tx.query.LIST_TASK.findMany({
          where: eq(LIST_TASK.listId, listId),
          with: {
            task: true,
            list: true,
          },
        })
      );
      userListName = listTasks[0]?.list?.name ?? "";
      userListTasks = listTasks.map((t) => t.task);
    }
  }

  console.log("re run in list/[listId] layout");

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="py-6 grid" style={{ gridTemplateRows: "1fr auto" }}>
        {!user && (
          <EmptyState
            isEmpty={!user}
            title="Please Sign-up/Login."
            subtitle=""
            icon={<Icon name="bf-i-ph-info" />}
            content={
              <>
                <Button variant="ghost" className="mt-3 justify-start">
                  <Icon name="bf-i-ph-sign-in" className="mie-1.5 c-base11" />
                  Sign Up / Login
                </Button>
              </>
            }
          ></EmptyState>
        )}
        {user && isSmartList ? (
          <SmartList listId={listId as SmartListId} tasks={smartListTasks} />
        ) : (
          <UserList listId={listId} tasks={userListTasks} listName={userListName ?? ""} />
        )}
        <TaskInput />
      </div>
      <>{children}</>
    </div>
  );
}
