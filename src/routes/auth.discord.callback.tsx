import { createFileRoute, redirect } from "@tanstack/react-router";
import { exchangeCode, getUserInfo, checkGuildMembership, signSession, buildAvatarUrl } from "@/lib/api/discord-auth.server";
import { getRequestUrl } from "@tanstack/react-start/server";

export const Route = createFileRoute("/auth/discord/callback")({
  loader: async () => {
    const url = getRequestUrl();
    const code = url.searchParams.get("code");
    const errorParam = url.searchParams.get("error");

    if (errorParam || !code) {
      throw redirect({ to: "/join" });
    }

    try {
      const origin =
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : `http://localhost:${process.env.PORT ?? 3000}`;
      const redirectUri = `${origin}/auth/discord/callback`;

      const token = await exchangeCode(code, redirectUri);
      const user = await getUserInfo(token.access_token);
      const joinedAt = await checkGuildMembership(user.id);

      const session = {
        id: user.id,
        username: user.username,
        globalName: user.global_name,
        avatar: buildAvatarUrl(user.id, user.avatar),
        discriminator: user.discriminator,
        inGuild: joinedAt !== null,
        joinedAt,
      };

      const cookie = signSession(session);

      throw redirect({
        to: "/join",
        headers: {
          "Set-Cookie": `kts_session=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
        },
      });
    } catch (err) {
      if (err instanceof Response) throw err;
      console.error("Discord auth callback error:", err);
      throw redirect({ to: "/join" });
    }
  },
  component: () => null,
});
