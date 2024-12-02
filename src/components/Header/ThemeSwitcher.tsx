"use client";

import { setThemeCookie } from "@/app/actions";
import Icon from "@/components/ui/Icon";
import useSettingsMutation from "@/hooks/useSettingsMutation";
import useUserMe from "@/hooks/useUserMe";
import { Settings } from "@/types";
import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../Provider";
import Button from "../ui/Button";
import Card from "../ui/Card";

type Theme = Settings["theme"];

export const ThemeSwitcher = () => {
  const { theme: themeFromCookie, useSystemTheme } = useGlobalContext();
  const [_theme, _setTheme] = useState<Theme | null>(null);

  const theme = _theme ?? (useSystemTheme ? "system" : themeFromCookie);

  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  // const systemTheme = useOSTheme();
  const settingsMutation = useSettingsMutation();
  const userMeQ = useUserMe();

  const setTheme = async (to: Theme) => {
    async function changeToDark() {
      root.classList.remove("light-theme");
      root.classList.add("dark-theme");
    }

    async function changeToLight() {
      root.classList.remove("dark-theme");
      root.classList.add("light-theme");
    }

    const root = document.getElementsByTagName("html")[0];

    if (to === "dark") {
      changeToDark();
      _setTheme("dark");
      await setThemeCookie({ theme: "dark", useSystemTheme: false });
    }
    if (to === "light") {
      changeToLight();
      _setTheme("light");
      await setThemeCookie({ theme: "light", useSystemTheme: false });
    }
    if (to === "system" && getSystemTheme() === "light") {
      changeToLight();
      _setTheme("system");
      await setThemeCookie({ theme: "light", useSystemTheme: true });
    }
    if (to === "system" && getSystemTheme() === "dark") {
      changeToDark();
      _setTheme("system");
      await setThemeCookie({ theme: "dark", useSystemTheme: true });
    }
    if (userMeQ.data) {
      settingsMutation.mutate({ theme: to });
    }
  };

  useEffect(() => {
    if (!setTheme || !theme) return;
    if (theme === "system") setTheme("system");
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      if (theme === "system") setTheme("system");
    });
  }, [setTheme, theme]);

  return (
    <div>
      <RadixToggleGroup.Root value={theme} onValueChange={setTheme} type="single">
        <Card className="flex gap-1 w-fit !b-none" size="sm">
          <RadixToggleGroup.Item value="light" asChild>
            <Button variant="ghost" iconButton size="sm">
              <Icon name="bf-i-ph-sun" />
              <span className="sr-only">Light Color Scheme</span>
            </Button>
          </RadixToggleGroup.Item>
          <RadixToggleGroup.Item value="dark" asChild>
            <Button variant="ghost" iconButton size="sm">
              <Icon name="bf-i-ph-moon" />
              <span className="sr-only">Dark Color Scheme</span>
            </Button>
          </RadixToggleGroup.Item>
          <RadixToggleGroup.Item value="system" asChild>
            <Button variant="ghost" iconButton size="sm">
              <Icon name="bf-i-ph-device-mobile" className="sm:hidden" />
              <Icon name="bf-i-ph-laptop" className="lt-sm:hidden" />
              <span className="sr-only">Follow System Color Scheme</span>
            </Button>
          </RadixToggleGroup.Item>
        </Card>
      </RadixToggleGroup.Root>
    </div>
  );
};
