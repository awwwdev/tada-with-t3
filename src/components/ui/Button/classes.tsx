import { AllProps } from './types';

const parts = {
  borderColor: {
    transparent: "b-transparent",
    gray: "b-base6 hover:b-base7 active:b-base7",
    accent: "b-accent7 hover:b-accent8 active:b-accent8",
  },
  bg: {
    transparent: {
      gray: "hover:bg-base2A active:bg-base3A data-[state=on]:bg-base3A",
      accent: "hover:bg-accent2A active:bg-accent3A data-[state=on]:bg-accent3A",
    },
    soft: {
      gray: "bg-base3A hover:bg-base4 active:bg-base5",
      accent: "bg-accent3A hover:bg-accent4A active:bg-accent5A",
    },
    solid: {
      gray: "bg-black12A hover:bg-black12A/60  active:bg-black12A/30 ",
      accent: "bg-accent9 hover:bg-accent10 active:bg-accent11",
    },
  },
  textColor: {
    gray: "",
    accent: "c-accent11",
    white: "c-white",
  },
};


const disabled: Record<AllProps["variant"] | 'base', string>   = {
  base: `aria-[disabled]:cursor-not-allowed  aria-[disabled]:c-base10  `,
  text: `  aria-[disabled]:c-base10 aria-[disabled]:b-transparent`,
  "text-accent": ` aria-[disabled]:c-base10 aria-[disabled]:b-transparent`,
  soft: ` aria-[disabled]:c-base10 aria-[disabled]:bg-base4 aria-[disabled]:b-transparent`,
  "soft-accent": ` aria-[disabled]:c-base10 aria-[disabled]:bg-base4 aria-[disabled]:b-transparent`,
  ghost: ` aria-[disabled]:c-base10 aria-[disabled]:b-base4`,
  "ghost-accent": ` aria-[disabled]:c-base10 aria-[disabled]:b-base4`,
  solid: "aria-[disabled]:bg-base8 aria-[disabled]:c-base2 aria-[disabled]:b-transparent",
  "solid-accent": "aria-[disabled]:bg-base8 aria-[disabled]:c-base2 aria-[disabled]:b-transparent",
  outline: "",
  "outline-accent": "",
} as const;


export const classes   = {
  base: ` b-1 fw-500 cursor-pointer appearance-none underline-none text-center whitespace-nowrap leading-1em
  focus-visible:outline-accent11
  focus:outline-accent9
  focus:outline-offset-3
  focus:outline-1.5
  `,
  text: `${parts.textColor.gray} ${parts.borderColor.transparent} ${parts.bg.transparent.gray}`,
  "text-accent": `${parts.textColor.accent} ${parts.borderColor.transparent} ${parts.bg.transparent.accent}`,
  ghost: ` ${parts.textColor.gray} ${parts.borderColor.gray} ${parts.bg.transparent.gray}`,
  "ghost-accent": `${parts.textColor.accent} ${parts.borderColor.accent} ${parts.bg.transparent.accent}`,
  soft: `${parts.textColor.gray} ${parts.borderColor.transparent} ${parts.bg.soft.gray}  `,
  "soft-accent": `${parts.textColor.accent} ${parts.borderColor.transparent} ${parts.bg.soft.accent}`,
  outline: `${parts.textColor.gray} ${parts.borderColor.gray} ${parts.bg.soft.gray}  `,
  "outline-accent": `${parts.textColor.accent} ${parts.borderColor.accent} ${parts.bg.soft.accent}`,
  solid: `${parts.textColor.white} ${parts.borderColor.transparent} ${parts.bg.solid.gray}`,
  "solid-accent": `${parts.textColor.white} ${parts.borderColor.transparent} ${parts.bg.solid.accent}`,
  disabled
} as const;

