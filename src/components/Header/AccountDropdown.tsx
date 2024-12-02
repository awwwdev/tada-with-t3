"use client";

import Icon from "@/components/ui/Icon";

import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useLogOut from "@/hooks/useLogOut";
import useUserMe from "@/hooks/useUserMe";
import Avatar from "../ui/Avatar";
import MenuItem from "../ui/MenuItem/MenuItem";

export default function AccountDropdown() {
  const userMeQ = useUserMe();

  const logoutMutation = useLogOut();

  return (
    <div>
      <DropdownMenu
        trigger={
          <MenuItem size="xl" className="flex gap-1.5 ">
            <Avatar src="" size="1em" />
            <span className="c-base11">{userMeQ.data?.email}</span>
            {!userMeQ.data && userMeQ.data?.emailConfirmedAt && (
              <span className="text-sm c-base11">Please Confirm your email</span>
            )}
          </MenuItem>
        }
      >
        <DropdownMenuItem onSelect={() => logoutMutation.mutate()}>
          {logoutMutation.isPending ? <LoadingSpinner /> : <Icon name="bf-i-ph-sign-out" className="c-base11 mie-3" />}
          Logout
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}
