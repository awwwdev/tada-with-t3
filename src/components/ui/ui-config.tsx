export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export const ui = {
  pd: {
    x: {
      xs: "px-[0.0625rem]",
      sm: "px-[0.125rem]",
      md: "px-[0.375rem]",
      lg: "px-[0.5rem]",
      xl: "px-[0.75rem]",
    },
    btn: {
      x: {
        xs: "px-[0.875rem]",
        sm: "px-[1rem]",
        md: "px-[1.375rem]",
        lg: "px-[1.875rem]",
        xl: "px-[2.5rem]",
      },
    },
  },
  h: {
    xs: "h-[1.75rem]",
    sm: "h-[2rem]",
    md: "h-[2.75rem]",
    lg: "h-[3.75rem]",
    xl: "h-[5rem]",
  },
  w: {
    xs: "w-[1.75rem]",
    sm: "w-[2rem]",
    md: "w-[2.75rem]",
    lg: "w-[3.75rem]",
    xl: "w-[5rem]",
  },
  rd: {
    xs: "rd-0.25rem",
    sm: "rd-0.25rem",
    md: "rd-0.5rem",
    lg: "rd-0.75rem",
    xl: "rd-1rem",
  },
  gap: {
    xs: "gap-[0.875rem]",
    sm: "gap-[1rem]",
    md: "gap-[1.375rem]",
    lg: "gap-[1.875rem]",
  },
} as const;

export const sizing = {
  padding: {
    xs: "0.25rem", // 1px
    sm: "0.375rem", // 2px
    md: "0.375rem", //6px
    lg: "0.5rem",
    xl: "0.75rem",
  },
  height: {
    xs: "1.75rem", // 28px
    sm: "2rem", // 32px
    md: "2.75rem", // 44px
    lg: "3.25rem", //52 
    xl: "4rem", // 64px
  },
  borderRadius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.5rem",
    xl: "0.625rem",
  },
} as const;

export function getSizeStyles(size: Size, isSquare = false): React.CSSProperties {
  return {
    padding: sizing.padding[size],
    height: sizing.height[size],
    borderRadius: sizing.borderRadius[size],
    width: isSquare ? sizing.height[size] : undefined,
    aspectRatio: isSquare ? "1/1" : undefined,
  };
}

// 48 40 32 24

// 60 44 32 28


export const smaller = { 
  xs: 'xs',
  sm: "xs",
  md: "sm",
  lg: "md", 
  xl: "lg"
}