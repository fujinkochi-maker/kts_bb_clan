import { writeFileSync } from "node:fs";

const CHANNEL_ID = "UCgzTqhCy0uMlr4qycLlCRHQ";
const API_KEY = process.env.YOUTUBE_API_KEY;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!API_KEY) {
  console.error("YOUTUBE_API_KEY environment variable is not set.");
  process.exit(1);
}

if (!WEBHOOK_URL) {
  console.error("DISCORD_WEBHOOK_URL environment variable is not set.");
  process.exit(1);
}

const API_URL =
  `https://www.googleapis.com/youtube/v3/search` +
  `?key=${API_KEY}` +
  `&channelId=${CHANNEL_ID}` +
  `&part=snippet` +
  `&order=date` +
  `&maxResults=1` +
  `&type=video`;

async function fetchLatestVideo() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API returned ${res.status}: ${text}`);
  }

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  const item = data.items[0];
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    href: `https://youtube.com/watch?v=${item.id.videoId}`,
    published: item.snippet.publishedAt,
    author: item.snippet.channelTitle,
  };
}

async function sendWebhook(video) {
  const content = `**${video.author ?? "KTS Rxtchett"} uploaded a new video**\n${video.href}`;

  const payload = { content };

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
  const lastVideoId = process.env.LAST_VIDEO_ID || "null";

  console.log(`Fetching latest video from YouTube Data API...`);
  const latest = await fetchLatestVideo();

  if (!latest) {
    console.log("No videos found for this channel.");
    return;
  }

  console.log(`Latest video: ${latest.title} (${latest.videoId})`);

  if (latest.videoId === lastVideoId) {
    console.log("No new video — last notified video matches.");
    return;
  }

  console.log("New video detected! Sending Discord webhook...");
  await sendWebhook(latest);

  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    writeFileSync(outputPath, `new_video_id=${latest.videoId}\n`, { flag: "a" });
  }

  console.log(`Done. Notified about: ${latest.videoId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
