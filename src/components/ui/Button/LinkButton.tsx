"use client";

import Link from 'next/link';
import { forwardRef } from "react";
import { getSizeStyles, Size } from "../ui-config";
import { classes } from './classes'; 
import { ButtonProps } from './types';

type Ref = HTMLAnchorElement;
type AllProps = React.ComponentPropsWithoutRef<"a"> & Omit<ButtonProps, "isLoading"> & { href: string; size?: Size };
const LinkButton = forwardRef<Ref, AllProps>(function (
  {
    className,
    size = "md",
    preStyled = true,
    variant,
    href,
    children,
    iconButton = false,
    rounded = false,
    ...props
  },
  ref
) {
  const cls = `inline-flex items-center justify-center  ${classes.base} ${classes[variant]}
      ${rounded ? "rd-full" : "rd-0.5em"}
      ${!iconButton ? "min-w-6em" : ""}
  `;

  return (
    <Link
      ref={ref}
      href={href}
      className={`${preStyled ? cls : ""} ${className}`}
      style={{
        textDecoration: "none",
        ...getSizeStyles(size, iconButton),
        paddingInline: iconButton ? undefined : `calc(3 * ${getSizeStyles(size, iconButton).padding})`,
      }}
      {...props}
    >
      {children}
    </Link>
  );
});

LinkButton.displayName = "LinkButton";
export default LinkButton;
