import process from "node:process";

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      botToken: process.env.DISCORD_BOT_TOKEN ?? "",
      guildId: process.env.DISCORD_GUILD_ID ?? "",
      publicKey: process.env.DISCORD_PUBLIC_KEY ?? "",
      webhookUrl: process.env.DISCORD_WEBHOOK_URL ?? "",
      webhookUrl2: process.env.DISCORD_WEBHOOK_URL2 ?? "",
    },
    sessionSecret: process.env.SESSION_SECRET ?? "kts-session-secret-change-me",
  };
}
