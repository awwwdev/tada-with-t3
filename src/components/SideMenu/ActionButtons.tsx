import Button from "@/components/ui/Button";
import useUserMe from "@/hooks/useUserMe";
import AccountDropdown from "../Header/AccountDropdown";
import { ThemeSwitcher } from "../Header/ThemeSwitcher";
import { useGlobalContext } from "../Provider";
import Icon from "../ui/Icon";
import MenuItem from "../ui/MenuItem/MenuItem";

export default function ActionButtons() {
  const { setListsPanelOpen, setSettingsPanelOpen, setShowAuthModal } = useGlobalContext();
  const userMeQ = useUserMe();
  return (
    <div className="grid gap-1.5">
      <AuthButtons />
      <Button
        variant="text"
        className=" justify-start gap-3 text-start"
        onClick={() => {
          if (userMeQ.data) {
            setListsPanelOpen(false);
            setSettingsPanelOpen(true);
          } else {
            setShowAuthModal(true);
          }
        }}
      >
        <Icon name="bf-i-ph-gear-six" className="mie-1.5 c-base11" />
        <span className="c-base11">Settings</span>
      </Button>{" "}
      {/* <LinkButton variant="text"  className="justify-start gap-3"> */}
      <a href="https://github.com/awwwdev/tada" className="text-start">
        <MenuItem size="xl" className="flex gap-1.5" onClick={() => setListsPanelOpen(false)}>
          <Icon name="bf-i-ph-github-logo" className="c-base11 mie-1.5" />
          <span className="c-base11">Source Code</span>
        </MenuItem>
      </a>
      <ThemeSwitcher />
    </div>
  );
}

function AuthButtons() {
  const userMeQ = useUserMe();
  const { setListsPanelOpen, setShowAuthModal } = useGlobalContext();

  return (
    <>
      {userMeQ.data ? (
        <AccountDropdown />
      ) : (
          <Button
            variant="text"
            className="text-start c-base11"
            onClick={() => {
              setListsPanelOpen(false);
              setShowAuthModal(true);
            }}
          >
            <Icon name="bf-i-ph-sign-in" className="mie-1.5 c-base11" />
            Sign Up / Login
          </Button>
      )}
    </>
  );
}
