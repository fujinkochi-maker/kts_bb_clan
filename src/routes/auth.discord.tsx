import { createFileRoute, redirect } from "@tanstack/react-router";
import { getOAuthUrl } from "@/lib/api/discord-auth.server";
import { createServerFn } from "@tanstack/react-start";

const getOrigin = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequest } = await import("@tanstack/react-start/server");
  const request = getRequest();
  const url = new URL(request.url);
  return url.origin;
});

export const Route = createFileRoute("/auth/discord")({
  loader: async () => {
    const origin = await getOrigin();
    const redirectUri = `${origin}/auth/discord/callback`;
    throw redirect({ href: getOAuthUrl(redirectUri) });
  },
  component: () => null,
});
