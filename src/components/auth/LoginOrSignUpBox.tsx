import Button from "@/components/ui/Button";
import Space from "@/components/ui/Space";
import Tabs from "@/components/ui/Tabs";
import Link from "next/link";
import { useState } from "react";
import LoginBox from "./LoginBox";
import SignUpBox from "./SignUpBox";

type TabValue = "signup" | "login";

export default function LoginOrSignUpBox({
  initialTab = "signup",
}: {
  initialTab?: TabValue;
}) {
  const [tabVelue, setTabValue] = useState<TabValue>(initialTab);
  return (
    <div className=" b-solid rd-lg w-full ">
      <div className="">
        <Tabs value={tabVelue} onValueChange={(v: TabValue) => setTabValue(v)}>
          <Tabs.TabsList className="flex gap-1.5  b-b-1 b-sand5">
            <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
          </Tabs.TabsList>
          <Space size="h-6" />
          <Tabs.Content value="signup">
            <SignUpBox />
            <p className="mt-8 text-sm c-sand11 text-center">
              Already a user?{` `}
              <Button className="underline" variant="text" preStyled={false} onClick={() => setTabValue("login")}>
                {" "}
                Login here.
              </Button>
            </p>
          </Tabs.Content>
          <Tabs.Content value="login">
            <LoginBox />
            <Space size="h-6" />
            <div>
              <p className=" fs-sm c-sand11 text-center">
                Forgot Password?{" "}
                <Link className="underline" href="/request-reset-password">
                  Reset it here.
                </Link>
              </p>
              <p className=" fs-sm c-sand11 text-center">
                No Account?{` `}
                <Button variant="text" className="underline" preStyled={false} onClick={() => setTabValue("signup")}>
                  {" "}
                  Sign Up here.
                </Button>
              </p>
            </div>
          </Tabs.Content>
        </Tabs>
        <div></div>
      </div>
    </div>
  );
}
