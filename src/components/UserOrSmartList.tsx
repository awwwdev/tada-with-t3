"use client";

import { useGlobalContext } from "@/components/Provider";
import SmartList from "@/components/SmartList";
import UserList from "@/components/UserList";

export default function UserOrSmartList() {
  const { currentList } = useGlobalContext();

  return (
    <>
      {currentList.type === "user-list" && <UserList listId={currentList.id} />}
      {currentList.type === "smart-list" && <SmartList listId={currentList.id} />}
    </>
  );
}
