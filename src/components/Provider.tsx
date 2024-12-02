"use client";

import useUserMe from "@/hooks/useUserMe";
import { SMART_LIST_IDS } from "@/schema/smartListTask.model";
import { CurrentList, SmartListId } from "@/types";
import type * as React from "react";
import { createContext, SetStateAction, useContext, useState } from "react";
import LoginOrSignUpBox from './auth/LoginOrSignUpBox';
import Modal from './ui/modal';

const initialCurrentList: CurrentList = {
  id: SMART_LIST_IDS.ALL_TASKS,
  type: 'smart-list',
}

type ContextType = {
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: React.Dispatch<SetStateAction<boolean>>;
  selectedTaskId: string | null;
  currentList: CurrentList
  setSelectedUserListId: (listId: string) => void;
  setSelectedSmartListId: (listId: SmartListId) => void;
  setSelectedTaskId: React.Dispatch<SetStateAction<string | null>>;
  theme: any;
  useSystemTheme: boolean;
  listsPanelOpen: boolean;
  detailsPanelOpen: boolean;
  setListsPanelOpen: React.Dispatch<SetStateAction<boolean>>;
  setDetailsPanelOpen: React.Dispatch<SetStateAction<boolean>>;
  settingsPanelOpen: boolean;
  setSettingsPanelOpen: React.Dispatch<SetStateAction<boolean>>;
  showAuthModal: boolean;
  setShowAuthModal: React.Dispatch<SetStateAction<boolean>>;
  confirmationModalOpen: boolean;
  setConfirmationModalOpen: React.Dispatch<SetStateAction<boolean>>;
};
const GlobalContext = createContext<ContextType>({
  isSideMenuOpen: false,
  selectedTaskId: null,
  currentList: initialCurrentList,
  setIsSideMenuOpen: () => {},
  setSelectedTaskId: () => {},
  setSelectedUserListId: () => {},
  setSelectedSmartListId: () => {},
  theme: "light",
  useSystemTheme: false,
  listsPanelOpen: false,
  detailsPanelOpen: false, 
  setListsPanelOpen: () => {},
  setDetailsPanelOpen: () => {},
  settingsPanelOpen: false,
  setSettingsPanelOpen: () => {},
  showAuthModal: false,
  setShowAuthModal: () => {},
  confirmationModalOpen: false,
  setConfirmationModalOpen: () => {}
});

export default function Providers({
  children,
  theme,
  useSystemTheme,
}: {
  children: React.ReactNode;
  theme: any;
  useSystemTheme: boolean;
}) {
  useUserMe(); // to initialize userMe
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentList , _setCurrentList] = useState<CurrentList>(initialCurrentList);

  const [listsPanelOpen, setListsPanelOpen] = useState(false);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);


  const setSelectedUserListId = (id: string) => {
    _setCurrentList({id, type: 'user-list'});
  }
  const setSelectedSmartListId = (id: SmartListId) => {
    _setCurrentList({id, type: 'smart-list'});
  }




  return (
    <GlobalContext.Provider
      value={{
        selectedTaskId,
        currentList,
        setSelectedUserListId,
        setSelectedSmartListId,
        setSelectedTaskId,
        isSideMenuOpen,
        setIsSideMenuOpen,
        theme,
        useSystemTheme,
        listsPanelOpen,
        detailsPanelOpen,
        setDetailsPanelOpen,
        setListsPanelOpen,
        settingsPanelOpen,
        setSettingsPanelOpen,
        setShowAuthModal,
        showAuthModal,
        confirmationModalOpen,
        setConfirmationModalOpen
      }}
    >
      {children}
      <Modal open={showAuthModal} setOpen={setShowAuthModal} title="Please Sign-up or Login first">
        <LoginOrSignUpBox initialTab="login" />
      </Modal>
      <Modal open={confirmationModalOpen} setOpen={setConfirmationModalOpen}>
        <p>Please confirm your email first..</p>
        <p className="text-sm c-base11">We sent you a new confirmation link to your email.</p>
      </Modal>


    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
