import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode — no SSR. Required for browser-only libraries like @dnd-kit.
  ssr: false,
} satisfies Config;
