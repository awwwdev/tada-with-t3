import React, { forwardRef, useMemo } from "react";
import { getSizeStyles, Size } from "../ui-config";

const variants = ["base"] as const;

export type CardProps = {
  variant?: (typeof variants)[number];
  size?: Size;
  preStyled?: boolean;
  className?: string;
  elevation?: "none" | "sm" | "md" | "lg";
  width?: string;
  style?: React.CSSProperties;
};
export type Ref = HTMLButtonElement;
export type AllProps = React.ComponentPropsWithoutRef<"div"> & CardProps;

const CardRoot = forwardRef<HTMLDivElement, AllProps>(function Button(
  { preStyled = true, className, variant = "base", children, size = "md", elevation = "none", width, ...props },
  ref
) {
  const shadow = useMemo(() => {
    if (elevation === "none") return "";
    if (elevation === "sm") return "shadow-lg shadow-black/50";
    if (elevation === "md") return "shadow-xl shadow-black/50";
    if (elevation === "lg") return "shadow-2xl shadow-black/50";
  }, [elevation]);

  return (
    <div
      {...props}
      className={` ${shadow}   b-1 b-base6 bg-base2 ${className}`}
      ref={ref}
      style={
        {
          "--card-border-radius": `calc(${getSizeStyles(size).borderRadius} + var(--card-padding))`,
          borderRadius: "var(--card-border-radius)",
          padding: "var(--card-padding)",
          "--card-padding": `calc( 1.5 * ${getSizeStyles(size).padding})`,
          width,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
});

CardRoot.displayName = "Card";

function Inset({ children }: { children: React.ReactNode }) {
  return <div style={{ margin: "calc(-1 * var(--card-padding))" }}>{children}</div>;
}

Inset.displayName = "Inset";

function Header({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <header
      style={{
        ...style,
        margin: "calc(-1 * var(--card-padding))",
        marginBottom: "var(--card-padding)",
        padding: "var(--card-padding)",
        borderTopLeftRadius: "var(--card-border-radius)",
        borderTopRightRadius: "var(--card-border-radius)",
      }}
      className={`b-b-1 b-base6 bg-base2A ${className}`}
    >
      {children}
    </header>
  );
}

Header.displayName = "Header";

function Body({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...style,
        margin: "calc(-1 * var(--card-padding))",
        marginTop: "var(--card-padding)",
        marginBottom: "var(--card-padding)",
        paddingLeft: "var(--card-padding)",
        paddingRight: "var(--card-padding)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

Body.displayName = "Body";

function Footer({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <footer
      style={{
        ...style,
        margin: "calc(-1 * var(--card-padding))",
        marginTop: "var(--card-padding)",
        padding: "var(--card-padding)",
        // borderTopLeftRadius: getSizeStyles(size).borderRadius,
        borderBottomLeftRadius: "var(--card-border-radius)",
        borderBottomRightRadius: "var(--card-border-radius)",
      }}
      className={`b-t-1 b-base6 bg-base2A ${className}`}
    >
      {children}
    </footer>
  );
}

Footer.displayName = "Footer";

const Card = Object.assign(CardRoot, { Inset, Header, Footer, Body });

export default Card;
