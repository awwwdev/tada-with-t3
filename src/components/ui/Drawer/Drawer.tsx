"use client";

import * as Portal from "@radix-ui/react-portal";
import { CSSProperties } from "react";

type Props = {
  side: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export default function Drawer({ side, disabled, open, setOpen, children }: Props) {
  let closedTranalate = "translateX(0%) translateY(0%)";
  if (side === "left") closedTranalate = "translateX(-100%) translateY(0%)";
  if (side === "right") closedTranalate = "translateX(100%) translateY(0%)";
  if (side === "top") closedTranalate = "translateX(0%) translateY(-100%)";
  if (side === "bottom") closedTranalate = "translateX(0%) translateY(100%)";

  return (
    <>
      <Portal.Root >
        {<Overlay open={open} setOepn={setOpen} />}
        <div
          style={
            {
              position: "fixed",
              display: 'grid',
              zIndex: 100,
              top: side === 'bottom' ? undefined : 0,
              bottom: side === 'top' ? undefined : 0,
              left: side === 'right' ? undefined : 0,
              right: side === 'left' ? undefined : 0,
              width: side === "top" || side === "bottom" ? "100%" : undefined,
              height: side === "left" || side === "right" ? "100%" : undefined,
              transform: open ? "translateX(0%) translateY(0%)" : closedTranalate,
              transition: "transform 0.3s ease-in-out",

            } as CSSProperties
          }
        >
          {children}
        </div>
      </Portal.Root>
    </>
  );
}

function Overlay({ open, setOepn }: { open: boolean; setOepn: (open: boolean) => void }) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-10  
        ${open ? "opacity-100" : "opacity-10"}
        ${open ? "" : "pointer-events-none"}
        `}
      onClick={() => {
        console.log('dklshflhd')
        setOepn(false);
      }}
    ></div>
  );
}
