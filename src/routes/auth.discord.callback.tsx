import { createFileRoute } from "@tanstack/react-router";

// Callback handling is done in src/server.ts to reliably set the session
// cookie on the redirect response (avoids import-protection issues with
// @tanstack/react-start/server in route files).
export const Route = createFileRoute("/auth/discord/callback")({
  component: () => null,
});
