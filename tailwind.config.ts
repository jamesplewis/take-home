import type { Config } from "tailwindcss"

import { shadcnPreset } from "./lib/shadcn-preset"

const config = {
  presets: [shadcnPreset],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "codemod-gray": {
          "50": "#f0f2f5",
          "100": "#e9ecf0",
          "200": "#d8dee5",
          "300": "#bdc6d3",
          "400": "#9eaabc",
          "500": "#8693ab",
          "600": "#747f9c",
          "700": "#68718d",
          "800": "#585e75",
          "900": "#494e5f",
          "950": "#2f323c",
        },
        "codemod-blue": {
          "50": "#f2f8fd",
          "100": "#e4effa",
          "200": "#c3e0f4",
          "300": "#8ec6eb",
          "400": "#52a9de",
          "500": "#2c8fcb",
          "600": "#1d72ac",
          "700": "#185b8c",
          "800": "#184e74",
          "900": "#194161",
          "950": "#060f17",
        },
        "codemod-lime": {
          "50": "#fbffe5",
          "100": "#f4ffc7",
          "200": "#e7ff95",
          "300": "#d7ff69",
          "400": "#bcf625",
          "500": "#9cdd05",
          "600": "#79b100",
          "700": "#5b8605",
          "800": "#49690b",
          "900": "#3d590e",
          "950": "#1f3201",
        },
      },
    },
  },
} satisfies Config

export default config
