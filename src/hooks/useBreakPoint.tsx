import { useMediaQuery } from "usehooks-ts";

export default function useBreakPoint() {
  const xxs = useMediaQuery("(min-width: 420px)");
  const xs = useMediaQuery("(min-width: 480px)");
  const sm = useMediaQuery("(min-width: 640px)");
  const md = useMediaQuery("(min-width: 768px)");

  return { xxs, xs, sm, md };
}
