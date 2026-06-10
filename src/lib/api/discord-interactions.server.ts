import crypto from "node:crypto";
import { getServerConfig } from "../config.server";

export async function handleDiscordInteraction(request: Request): Promise<Response | null> {
  try {
    const requestUrl = request.url;
    if (!requestUrl.includes("/api/discord/interactions")) return null;
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { discord } = getServerConfig();
    const publicKey = discord.publicKey;
    if (!publicKey) {
      return new Response(JSON.stringify({ error: "Public key not configured" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");
    const rawBody = await request.text();

    if (!signature || !timestamp) {
      return new Response(JSON.stringify({ error: "Missing signature headers" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const rawKey = Buffer.from(publicKey, "hex");
    const derPrefix = Buffer.from("302a300506032b6570032100", "hex");
    const derKey = Buffer.concat([derPrefix, rawKey]);
    const keyObject = crypto.createPublicKey({
      key: derKey,
      format: "der",
      type: "spki",
    });

    const isValid = crypto.verify(
      null,
      Buffer.from(timestamp + rawBody),
      keyObject,
      Buffer.from(signature, "hex"),
    );

    if (!isValid) {
      console.error("Discord interaction: invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const interaction = JSON.parse(rawBody);

    if (interaction.type === 1) {
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { "content-type": "application/json" },
      });
    }

    if (interaction.type === 3) {
      return handleButtonInteraction(interaction);
    }

    return new Response(JSON.stringify({ error: "Unknown interaction type" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Discord interaction error:", error);
    return null;
  }
}

function handleButtonInteraction(interaction: Record<string, unknown>): Response {
  const customId = (interaction.data as Record<string, unknown>)?.custom_id as string | undefined;
  const member = interaction.member as Record<string, unknown> | undefined;
  const user = member?.user as Record<string, unknown> | undefined;
  const displayName = (user?.global_name as string) || (user?.username as string) || "Unknown";

  const msg = interaction.message as Record<string, unknown> | undefined;
  const embeds = msg?.embeds as Record<string, unknown>[] | undefined;
  const originalEmbed = embeds?.[0];
  if (!originalEmbed) {
    return jsonResponse({
      type: 4,
      data: { content: "Could not find the application embed.", flags: 64 },
    });
  }

  const fields = (originalEmbed.fields as Record<string, unknown>[]) || [];
  const existingStatus = fields.some((f: Record<string, unknown>) => f.name === "Status");
  if (existingStatus) {
    return jsonResponse({
      type: 4,
      data: { content: "This application has already been decided.", flags: 64 },
    });
  }

  let statusValue: string;
  let color: number;

  if (customId === "kts_app_accept") {
    statusValue = `✅ Accepted by ${displayName}`;
    color = 0x57f287;
  } else if (customId === "kts_app_deny") {
    statusValue = `❌ Denied by ${displayName}`;
    color = 0xed4245;
  } else {
    return jsonResponse({
      type: 4,
      data: { content: "Unknown action.", flags: 64 },
    });
  }

  return jsonResponse({
    type: 7,
    data: {
      embeds: [
        {
          ...originalEmbed,
          color,
          fields: [...fields, { name: "Status", value: statusValue }],
        },
      ],
      components: [],
    },
  });
}

function jsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
