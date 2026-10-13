import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode - no SSR. Required for browser-only libraries like @dnd-kit.
  ssr: false,
  basename: process.env.BASE_PATH ?? "/",
} satisfies Config;
