import { Size } from '../ui-config';

const variants = ["ghost", "ghost-accent", "solid", "solid-accent", "text", "text-accent", "soft", "soft-accent", "outline", "outline-accent"] as const;

export type ButtonProps = {
  variant: typeof variants[number];
  isLoading?: boolean;
  iconButton?: boolean;
  preStyled?: boolean;
  rounded?: boolean;
  before?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: "button" | "reset" | "submit";
  size?: Size;
};
export type Ref = HTMLButtonElement;
export type AllProps = React.ComponentPropsWithoutRef<"button"> & ButtonProps;