import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Crown, Youtube } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CrackOverlay } from "@/components/crack-overlay";
import { MemberDetail } from "@/components/member-detail";
import { communityPillars, discordUrl, featuredMembers, founders, members, siteName, visuals } from "@/lib/kts-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KTS Clan - Home" },
      {
        name: "description",
        content: "Step into the KTS world with member showcases and direct access to the Discord community.",
      },
      { property: "og:title", content: "KTS Clan - Home" },
      {
        property: "og:description",
        content: "Step into the KTS world with member showcases and direct access to the Discord community.",
      },
      { property: "og:image", content: visuals.banner },
      { name: "twitter:title", content: "KTS Clan - Home" },
      {
        name: "twitter:description",
        content: "Step into the KTS world with member showcases and direct access to the Discord community.",
      },
      { name: "twitter:image", content: visuals.banner },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [selectedMember, setSelectedMember] = useState<typeof featuredMembers[number] | null>(null);

  return (
    <div>
      <MemberDetail member={selectedMember} open={!!selectedMember} onOpenChange={(o) => { if (!o) setSelectedMember(null); }} />
      <section className="kts-hero border-b border-line/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-35"
          style={{ backgroundImage: `url(${visuals.banner})` }}
        />
        <div aria-hidden="true" className="kts-hero-overlay" />
        <CrackOverlay className="text-primary/20" />
        <div aria-hidden="true" className="kts-particles">
          <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <div className="kts-container relative grid items-center gap-10 py-16 lg:grid-cols-[1fr_1fr] lg:py-24">
          <div className="animate-fade-in pl-6 sm:pl-10 lg:pl-16">
            <p className="kts-eyebrow">KTS Clan</p>
            <h1 className="kts-display max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
              Built for Legacy Boxing Beta.
            </h1>
            <p className="kts-copy mt-6 max-w-2xl text-lg sm:text-xl">
              A Boxing Beta clan that is built for competition and community.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a href={discordUrl} target="_blank" rel="noreferrer" onClick={() => toast("Redirecting to Discord...")} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground uppercase tracking-wider transition-colors hover:text-foreground">
                Join Discord
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <Link to="/about" className="text-sm font-medium text-muted-foreground uppercase tracking-wider transition-colors hover:text-foreground">
                Meet the roster
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center animate-scale-in">
            <div className="group cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:drop-shadow-[0_0_60px_var(--color-glow)]">
              <img
                src={visuals.logo}
                alt="KTS crest logo"
                className="h-auto w-72 object-contain transition-all duration-700 ease-out group-hover:brightness-110 lg:w-96"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="kts-section border-b border-line/70">
        <div className="kts-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <p className="kts-eyebrow">Core identity</p>
            <h2 className="kts-display text-3xl sm:text-4xl">A clan built for competition.</h2>
            <p className="kts-copy mt-5">
              {siteName} is a Boxing Beta clan that is built for the community to help eachother.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            {communityPillars.map((pillar) => (
              <article key={pillar.title} className="kts-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_30px_var(--color-glow)]">
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-display text-xl text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-base text-muted-foreground">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kts-section border-b border-line/70">
        <div className="kts-container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <div>
              <p className="kts-eyebrow">Featured members</p>
              <h2 className="kts-display text-3xl sm:text-4xl">Faces behind the signal.</h2>
            </div>
            <Link to="/about" className="story-link text-base text-muted-foreground">
              View full roster
            </Link>
          </div>

          <div className="mt-8 overflow-hidden mask-scroll animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="flex gap-5 animate-scroll hover:pause">
              {[...members, ...members].map((member, index) => (
                <article key={`${member.name}-${index}`} className="kts-member-card w-72 shrink-0 cursor-pointer" onClick={() => setSelectedMember(member)}>
                  <img src={member.image} alt={`${member.name} KTS member graphic`} className="kts-image-fill" loading="lazy" />
                    <div className="relative z-10 p-5">
                      <h3 className="font-display text-2xl text-foreground">{member.name}</h3>
                      <p className="mt-2 text-base text-muted-foreground">{member.tagline}</p>
                      {member.youtube && (
                        <a href={member.youtube} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </a>
                      )}
                    </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kts-section border-b border-line/70">
        <div className="kts-container grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <p className="kts-eyebrow">Founders</p>
            <h2 className="kts-display text-3xl sm:text-4xl">Built from scratch.</h2>
            <p className="kts-copy mt-5">
              The ones who laid the foundation. KTS exists because of the vision and drive behind it.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            {founders.map((f) => (
              <article key={f.name} className="kts-founder-card">
                <Crown className="absolute right-3 top-3 z-20 h-5 w-5 text-accent/60" />
                {f.image ? (
                  <img src={f.image} alt={`${f.name} founder graphic`} className="kts-image-fill" />
                ) : (
                  <div className="kts-image-fill flex flex-col items-center justify-center gap-3 bg-panel/60">
                    <span className="font-display text-5xl text-muted-foreground/20">K3</span>
                    <span className="rounded-full border border-dashed border-muted-foreground/30 px-4 py-1.5 font-body text-sm text-muted-foreground/50">
                      Coming Soon
                    </span>
                  </div>
                )}
                <div className="relative z-10 p-5">
                  <p className="kts-eyebrow">{f.role}</p>
                  <h3 className="font-display text-2xl text-foreground">{f.name}</h3>
                  {f.tagline && (
                    <p className="mt-2 text-base text-muted-foreground">{f.tagline}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kts-section">
        <div className="kts-container grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="kts-surface overflow-hidden p-0 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <img src={visuals.gym} alt="KTS building and gym environment" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <p className="kts-eyebrow">Always connected</p>
            <h2 className="kts-display text-3xl sm:text-4xl">The Discord is the front door.</h2>
            <p className="kts-copy mt-5">
              Everything routes back to the community: the energy, the member presence, the updates, and
              the shared identity. If you want in, the invite stays open.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="kts-button-primary">
                <a href={discordUrl} target="_blank" rel="noreferrer">
                  Open Discord
                </a>
              </Button>
              <Button asChild variant="outline" className="kts-button-secondary">
                <Link to="/discord-community">Community page</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
