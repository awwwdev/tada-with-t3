import { defineConfig, presetIcons, presetUno, transformerVariantGroup } from "unocss";
// import * as radixColors from '@radix-ui/colors';
import { rules, shortcuts } from "./uno-rules";
import { presetRadix } from './unocss-preset-radix';
// import presetPrimitives from "unocss-preset-primitives";
export default defineConfig({
  rules,
  // @ts-ignore
  shortcuts,
  theme: {
    colors: {
      subdued: "var(--rx-slate11)",
    },
    breakpoints: {
      xxs: "420px",
      xs: "480px",
      sm: "640px",
      md: "768px",
    },
  },
  transformers: [transformerVariantGroup()],
  presets: [
    presetUno({
      dark: "class",
    }),
    presetIcons(),
    presetRadix({
      prefix: "--rx-",
      darkSelector: ".dark-theme",
      lightSelector: ".light-theme",
      aliases: {
        accent: "orange",
        base: "slate",
        success: "jade",
        warning: "amber",
        error: "tomato",
        info: "blue",
        danger: "tomato"
      },
      useP3Colors: true,
    }),
  ],
});
