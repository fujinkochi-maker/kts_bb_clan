import { createFileRoute } from "@tanstack/react-router";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrackOverlay } from "@/components/crack-overlay";
import { visuals } from "@/lib/kts-content";

export const Route = createFileRoute("/kts-content")({
  head: () => ({
    meta: [
      { title: "KTS Clan - KTS Content" },
      {
        name: "description",
        content: "Watch the latest Boxing Beta videos from KTS Rxtchett's YouTube channel.",
      },
      { property: "og:title", content: "KTS Clan - KTS Content" },
      {
        property: "og:description",
        content: "Watch the latest Boxing Beta videos from KTS Rxtchett.",
      },
      { property: "og:image", content: visuals.gym },
      { name: "twitter:title", content: "KTS Clan - KTS Content" },
      {
        name: "twitter:description",
        content: "Boxing Beta videos and KTS content from Rxtchett.",
      },
      { name: "twitter:image", content: visuals.gym },
    ],
  }),
  component: KtsContentPage,
});

function KtsContentPage() {
  const playlistId = "UUgzTqhCy0uMlr4qycLlCRHQ";

  return (
    <div>
      <section className="kts-section relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
          style={{ backgroundImage: `url(${visuals.banner})` }}
        />
        <div aria-hidden="true" className="kts-hero-overlay" />
        <CrackOverlay />
        <div className="kts-container relative grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="animate-fade-in-up pl-6 sm:pl-10 lg:pl-16" style={{ animationDelay: "0ms" }}>
            <p className="kts-eyebrow">KTS Content</p>
            <h1 className="kts-display text-5xl sm:text-6xl lg:text-7xl">Watch Rxtchett’s full uploads playlist.</h1>
            <p className="kts-copy mt-6 max-w-2xl text-lg sm:text-xl">
              Dive into Boxing Beta gameplay, clan highlights, and the newest uploads from the KTS channel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="kts-button-primary">
                <a href="https://www.youtube.com/@Rxtchet1" target="_blank" rel="noreferrer">
                  <Youtube className="h-4 w-4" />
                  Subscribe on YouTube
                </a>
              </Button>
            </div>
          </div>

          <div className="kts-surface overflow-hidden p-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
              width="100%"
              height="600"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-xl border border-line/70"
              title="KTS Rxtchett YouTube playlist"
            />
            <div className="p-6 sm:p-8">
              <p className="text-sm text-muted-foreground">
                This player embeds the full uploads playlist for Rxtchett’s channel. New videos appear automatically as they are published.
              </p>
              <p className="mt-3 text-sm">
                <a href="https://www.youtube.com/@Rxtchet1/videos" target="_blank" rel="noreferrer" className="text-primary underline">
                  Browse the channel on YouTube
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="kts-section border-b border-line/70">
        <div className="kts-container">
          <div className="kts-surface overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
                <p className="kts-eyebrow">Full playlist</p>
                <h2 className="kts-display text-3xl sm:text-4xl">All videos in one place.</h2>
                <p className="kts-copy mt-5">
                  Every upload from KTS Rxtchett's YouTube channel, browsable and playable directly.
                  New content shows up automatically — no manual updates needed.
                </p>
                <div className="mt-7">
                  <Button asChild className="kts-button-primary">
                    <a href="https://www.youtube.com/@Rxtchet1/videos" target="_blank" rel="noreferrer">
                      <Youtube className="h-4 w-4" />
                      View all videos
                    </a>
                  </Button>
                </div>
              </div>
              <div className="p-6 sm:p-8 lg:p-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <img src={visuals.logo} alt="KTS crest logo" className="h-14 w-14 object-contain shrink-0" />
                    <div>
                      <p className="font-display text-lg text-foreground">KTS Rxtchett</p>
                      <p className="text-sm text-muted-foreground">Content Creator</p>
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    KTS Rxtchett uploads Boxing Beta gameplay, ranked matches, and clan content.
                    Hit subscribe to stay locked in with the latest drops.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild className="kts-button-primary">
                      <a href="https://www.youtube.com/@Rxtchet1" target="_blank" rel="noreferrer">
                        <Youtube className="h-4 w-4" />
                        Subscribe
                      </a>
                    </Button>
                    <Button asChild className="kts-button-secondary">
                      <a href="https://www.youtube.com/@Rxtchet1/channel" target="_blank" rel="noreferrer">
                        Channel page
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
