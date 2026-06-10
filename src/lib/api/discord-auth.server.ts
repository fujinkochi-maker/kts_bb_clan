import { getServerConfig } from "../config.server";
import crypto from "node:crypto";

export function getOAuthUrl(redirectUri: string) {
  const { discord } = getServerConfig();
  const params = new URLSearchParams({
    client_id: discord.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds.members.read",
    prompt: "consent",
  });
  return `https://discord.com/api/oauth2/authorize?${params}`;
}

export async function exchangeCode(code: string, redirectUri: string) {
  const { discord } = getServerConfig();
  const body = new URLSearchParams({
    client_id: discord.clientId,
    client_secret: discord.clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

export async function getUserInfo(accessToken: string) {
  const res = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`User info failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<{
    id: string;
    username: string;
    discriminator: string;
    global_name: string | null;
    avatar: string;
  }>;
}

export async function checkGuildMembership(userId: string) {
  const { discord } = getServerConfig();
  if (!discord.botToken || !discord.guildId) return null;

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${discord.guildId}/members/${userId}`,
    { headers: { Authorization: `Bot ${discord.botToken}` } },
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    console.error(`Guild membership check failed: ${res.status}`);
    return null;
  }

  const data = (await res.json()) as { joined_at: string };
  return data.joined_at;
}

export function signSession(data: Record<string, unknown>): string {
  const { sessionSecret } = getServerConfig();
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(cookie: string | undefined): Record<string, unknown> | null {
  if (!cookie) return null;

  const { sessionSecret } = getServerConfig();
  const parts = cookie.split(".");
  if (parts.length !== 2) return null;

  const [payload, sig] = parts;
  const expected = crypto
    .createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

export function buildAvatarUrl(userId: string, avatarHash: string): string {
  if (avatarHash.startsWith("a_")) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.gif`;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
}
