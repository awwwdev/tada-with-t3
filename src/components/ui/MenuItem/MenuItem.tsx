import { CSSProperties, forwardRef } from "react";
import { getSizeStyles, Size, smaller } from "../ui-config";
import { classes } from "../Button/classes";

export type CardProps = {
  variant?: string;
  size?: Size;
  preStyled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
};
export type Ref = HTMLButtonElement;
export type AllProps = React.ComponentPropsWithoutRef<"div"> & CardProps;

const MenuItem = forwardRef<HTMLDivElement, AllProps>(function (
  { disabled, preStyled = true, className, variant = "text", children, size = "md", ...props },
  ref
) {
  const cls = ["relative isolate text-start  ", classes.base, disabled ? classes.disabled.base : classes[variant]].join(" ");

  return (
    <div
      ref={ref}
      className={`${preStyled && cls} ${className}`}
      aria-disabled={disabled}
      style={{
        ...getSizeStyles(size),
        "--menu-item-padding": getSizeStyles(size).padding,
        height: 'calc(var(--size-height) + var(--menu-item-padding) * 2)',
        // paddingInline: `calc(1 * ${getSizeStyles(size).padding})`,
        ...props?.style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
});

MenuItem.displayName = "MenuItem";
export default MenuItem;
// select item
// drop down menu item
// context menu Item

// data-state="on"
// data-state="off"
// data-disabled="true"
// data-highlighted="true"

// dropdown menu
// data-state='open'
// data-state='closed'
// data-state='checked'
// data-state='unchecked'
