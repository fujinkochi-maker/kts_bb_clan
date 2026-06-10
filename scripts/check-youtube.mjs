import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const CHANNEL_ID = "UCgzTqhCy0uMlr4qycLlCRHQ";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const WEBHOOK_URL = "https://discord.com/api/webhooks/1514120432259829922/2Ph6Wrt_JqUeItPYk6ZeSija8pe8I7AmgxSvDORluatZx09mxA2qrR0gR-hMqYrSdZJO";
const STATE_PATH = join(ROOT, "last-notified-video.json");

function readState() {
  if (!existsSync(STATE_PATH)) {
    return { videoId: null, published: null };
  }
  return JSON.parse(readFileSync(STATE_PATH, "utf-8"));
}

function writeState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

function parseFeed(xml) {
  const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
  if (!entryMatch) return null;

  const entry = entryMatch[1];
  const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
  const title = entry.match(/<title[^>]*>([^<]+)<\/title>/)?.[1];
  const href = entry.match(/<link[^>]*href="([^"]+)"[^>]*\/?>/)?.[1];
  const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
  const author = entry.match(/<name>([^<]+)<\/name>/)?.[1];

  if (!videoId) return null;

  return { videoId, title, href, published, author };
}

async function sendWebhook(video) {
  const embed = {
    title: video.title,
    url: video.href,
    color: 10070709,
    timestamp: video.published,
    author: {
      name: video.author ?? "KTS Rxtchett",
      url: "https://www.youtube.com/@Rxtchet1",
    },
    thumbnail: {
      url: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
    },
    fields: [
      {
        name: "Watch now",
        value: `[Click here](${video.href})`,
        inline: true,
      },
    ],
    footer: {
      text: "KTS Clan — YouTube Notifier",
    },
  };

  const payload = { embeds: [embed] };

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord webhook returned ${res.status}: ${text}`);
  }
}

async function main() {
  const state = readState();

  console.log(`Fetching YouTube RSS feed for channel ${CHANNEL_ID}...`);
  const res = await fetch(RSS_URL);
  if (!res.ok) {
    throw new Error(`RSS feed returned ${res.status}`);
  }

  const xml = await res.text();
  const latest = parseFeed(xml);

  if (!latest) {
    console.log("No video entries found in feed.");
    return;
  }

  console.log(`Latest video: ${latest.title} (${latest.videoId})`);

  if (latest.videoId === state.videoId) {
    console.log("No new video — last notified video matches.");
    return;
  }

  console.log("New video detected! Sending Discord webhook...");
  await sendWebhook(latest);

  writeState({ videoId: latest.videoId, published: latest.published });
  console.log("State updated. Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
