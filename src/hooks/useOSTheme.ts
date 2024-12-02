import { useEffect, useState } from "react";

export default () => {
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">('light');

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setSystemTheme("dark");
    } else {
      setSystemTheme("light");
    }

    const eventListner = window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      if (event.matches) {
        setSystemTheme("dark");
      } else {
        setSystemTheme("light");
      }
    });
    // return window.removeEventListener("change", eventListner);
  }, []);

  return systemTheme;
};
