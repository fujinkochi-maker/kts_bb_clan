import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageSquareMore, Shield, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DiscordMemberCount } from "@/components/discord-member-count";

import { discordUrl, visuals } from "@/lib/kts-content";

export const Route = createFileRoute("/discord-community")({
  head: () => ({
    meta: [
      { title: "KTS Clan - Discord Community" },
      {
        name: "description",
        content: "Join the KTS Discord community for live chat, member energy, and the main hub behind the clan.",
      },
      { property: "og:title", content: "KTS Clan - Discord Community" },
      {
        property: "og:description",
        content: "Enter the KTS Discord and connect directly with the community.",
      },
      { property: "og:image", content: visuals.gym },
      { name: "twitter:title", content: "KTS Clan - Discord Community" },
      {
        name: "twitter:description",
        content: "The official KTS Discord invite and community hub.",
      },
      { name: "twitter:image", content: visuals.gym },
    ],
  }),
  component: DiscordCommunityPage,
});

function DiscordCommunityPage() {
  return (
    <div>
      <section className="kts-hero border-b border-line/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
          style={{ backgroundImage: `url(${visuals.gym})` }}
        />
        <div aria-hidden="true" className="kts-hero-overlay" />
        <div aria-hidden="true" className="kts-particles">
          <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <div className="kts-container relative grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <p className="kts-eyebrow">Discord Community</p>
            <h1 className="kts-display text-5xl sm:text-6xl lg:text-7xl">Get inside the KTS server.</h1>
            <p className="kts-copy mt-6 max-w-2xl text-lg sm:text-xl">
              The server is where the community stays active, the conversation keeps moving, and the full KTS
              signal stays connected in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="kts-button-primary">
                <a href={discordUrl} target="_blank" rel="noreferrer" onClick={() => toast("Redirecting to Discord...")}>
                  Join Discord now
                </a>
              </Button>
            </div>
          </div>

          <div className="kts-surface p-6 sm:p-7 animate-fade-in-up transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_30px_var(--color-glow)]" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-4">
              <img src={visuals.logo} alt="KTS crest logo" className="h-18 w-18 object-contain" />
              <div>
                <p className="kts-eyebrow">Direct invite</p>
                <p className="font-display text-2xl text-foreground">discord.gg/wsf77h7Fmn</p>
                <DiscordMemberCount />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="kts-stat">
                <MessageSquareMore className="h-5 w-5" />
                <div>
                  <p className="font-display text-sm text-foreground">Live conversation</p>
                  <p className="text-sm text-muted-foreground">A direct line into the KTS community without friction.</p>
                </div>
              </div>
              <div className="kts-stat">
                <Users className="h-5 w-5" />
                <div>
                  <p className="font-display text-sm text-foreground">Member presence</p>
                  <p className="text-sm text-muted-foreground">Stay close to the roster, updates, and visual drops.</p>
                </div>
              </div>
              <div className="kts-stat">
                <Shield className="h-5 w-5" />
                <div>
                  <p className="font-display text-sm text-foreground">Central hub</p>
                  <p className="text-sm text-muted-foreground">The clearest way to plug into the brand and the people behind it.</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://discord.gg/wsf77h7Fmn");
                  toast("Invite link copied to clipboard!");
                }}
                className="kts-button-secondary w-full justify-center text-sm"
              >
                Copy invite link
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="kts-section border-b border-line/70">
        <div className="kts-container grid gap-5 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          {[
            {
              icon: Sparkles,
              title: "Fast entry",
              text: "One invite, one click, and you're directly in the community channel flow.",
            },
            {
              icon: Users,
              title: "Real member energy",
              text: "The site points people to the roster, while the Discord keeps them connected after the first impression.",
            },
            {
              icon: MessageSquareMore,
              title: "Always-on social layer",
              text: "Announcements, reactions, everyday talk, and community momentum all live here.",
            },
          ].map((item) => (
            <article key={item.title} className="kts-surface p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_30px_var(--color-glow)]">
              <item.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-display text-2xl text-foreground">{item.title}</h2>
              <p className="mt-3 text-base text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kts-section">
        <div className="kts-container">
          <div className="kts-surface overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <img src={visuals.banner} alt="Purple KTS clan banner artwork" className="h-full w-full object-cover animate-fade-in-up" loading="lazy" style={{ animationDelay: "0ms" }} />
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <p className="kts-eyebrow">Main call to action</p>
                <h2 className="kts-display text-3xl sm:text-4xl">Pull people into the real hub.</h2>
                <p className="kts-copy mt-5">
                  The website sets the tone. The Discord turns that tone into a live community. If someone wants the
                  full KTS experience, this is where they should land next.
                </p>
                <div className="mt-7">
                  <Button asChild className="kts-button-primary">
                    <a href={discordUrl} target="_blank" rel="noreferrer" onClick={() => toast("Opening Discord invite...")}>
                      Open invite
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
