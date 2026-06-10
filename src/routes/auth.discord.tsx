import { createFileRoute, redirect } from "@tanstack/react-router";
import { getOAuthUrl } from "@/lib/api/discord-auth.server";

export const Route = createFileRoute("/auth/discord")({
  loader: () => {
    const origin =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT ?? 3000}`;
    const redirectUri = `${origin}/auth/discord/callback`;
    throw redirect({ href: getOAuthUrl(redirectUri) });
  },
  component: () => null,
});
