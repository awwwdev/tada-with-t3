'use client';



import { useGlobalContext } from "@/components/Provider";
import SettingsPanel from "@/components/SettingsPanel";
import Drawer from "@/components/ui/Drawer";



export default function SettingsDrawer() {

  const {
    settingsPanelOpen,
    setSettingsPanelOpen,
  } = useGlobalContext();

  return (
    <Drawer side="right" open={settingsPanelOpen} setOpen={setSettingsPanelOpen}>
    <SettingsPanel />
  </Drawer>

  )
}