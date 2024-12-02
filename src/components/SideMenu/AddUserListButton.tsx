"use client";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/modal";
import { NewList } from "@/types";
import { useState } from "react";

import { useGlobalContext } from "@/components/Provider";
import useUserMe from "@/hooks/useUserMe";
import fetchAPI from "@/utils/fetchAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function AddUserListButton() {
  const queryClient = useQueryClient();

  const initialListDraft: NewList = {
    name: "",
    authorId: "",
    emojis: [],
  };
  const [showModal, setShowModal] = useState<boolean>(false);
  const [listDraft, setListDraft] = useState<NewList>(initialListDraft);

  const userMeQ = useUserMe();

  const addListM = useMutation({
    mutationFn: async (list: NewList) => {
      fetchAPI.POST(`/lists`, { ...list, authorId: userMeQ.data?.id })
    },
    onError: (err) => toast.error("Error: " + err.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMe"] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      setListDraft(initialListDraft);
      setShowModal(false);
    },
  });

  const { setShowAuthModal } = useGlobalContext();
  return (
    <>
      <Button
        variant="text"
        iconButton
        className="shrink-0"
        onClick={() => {
          if (!userMeQ.data) setShowAuthModal(true);
          if (userMeQ.data) setShowModal(true);
        }}
      >
        <Icon name="bf-i-ph-plus" className=" c-base11" />
        <span className="sr-only">Add a List</span>
      </Button>

      <Modal open={showModal} setOpen={setShowModal}>
        <div>
          <h3 className="H3">Add a List</h3>
          <div className="h-6"></div>
          <form
            className="mt-auto"
            onSubmit={(e) => {
              e.preventDefault();
              addListM.mutate(listDraft);
            }}
          >
            <div className="grid gap-3 items-end">
              <div className="grow">
                <Input
                  name="name"
                  label=""
                  type="text"
                  placeholder="New Folder"
                  value={listDraft.name}
                  autoFocus
                  onChange={(e) => setListDraft((s) => ({ ...s, name: e.target.value }))}
                />
              </div>
              <Button variant="solid" type="submit" isLoading={addListM.isPending} disabled={!userMeQ.data?.id}>
                <Icon name="bf-i-ph-plus" className="c-base11" />
                <span className="">Create</span>
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
