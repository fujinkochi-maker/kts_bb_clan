import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrackOverlay } from "@/components/crack-overlay";
import { MemberDetail } from "@/components/member-detail";
import { discordUrl, founders, members, visuals } from "@/lib/kts-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "KTS Clan - About Us" },
      {
        name: "description",
        content: "Explore the KTS roster, visual identity, and the member graphics powering the clan's esports presence.",
      },
      { property: "og:title", content: "KTS Clan - About Us" },
      {
        property: "og:description",
        content: "Meet the KTS members and see the visual style behind the clan.",
      },
      { property: "og:image", content: visuals.logo },
      { name: "twitter:title", content: "KTS Clan - About Us" },
      {
        name: "twitter:description",
        content: "Member cards, esports visuals, and the KTS clan identity.",
      },
      { name: "twitter:image", content: visuals.logo },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<typeof members[number] | null>(null);

  return (
    <div>
      <MemberDetail member={selectedMember} open={!!selectedMember} onOpenChange={(o) => { if (!o) setSelectedMember(null); }} />
      <section className="kts-section overflow-hidden border-b border-line/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
          style={{ backgroundImage: `url(${visuals.banner})` }}
        />
        <CrackOverlay />
        <div className="kts-container relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="animate-fade-in-up pl-6 sm:pl-10 lg:pl-16" style={{ animationDelay: "0ms" }}>
            <p className="kts-eyebrow">About Us</p>
            <h1 className="kts-display text-4xl sm:text-5xl lg:text-6xl">Learn About KTS</h1>
            <div className="mt-6 space-y-4">
              <p className="kts-copy text-lg">
                KTS is a clan in Boxing Beta focusing on movement, community, and competitiveness in players while learning from each other.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="kts-button-primary">
                <a href={discordUrl} target="_blank" rel="noreferrer">
                  Join the community
                </a>
              </Button>
            </div>
          </div>
          <div className="kts-surface overflow-hidden p-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <img src={visuals.banner} alt="KTS purple banner artwork" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="kts-section border-b border-line/70">
        <div className="kts-container">
          <div className="mb-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <p className="kts-eyebrow">Roster</p>
            <h2 className="kts-display text-3xl sm:text-4xl">KTS Members</h2>
            <p className="kts-copy mt-5">
              Each card carries its own mood, but the full lineup still lands under one KTS signal:
              dark, polished, animated, and built to stand out.
            </p>
          </div>

          <div className="overflow-hidden mask-scroll animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="flex gap-5 animate-scroll hover:pause">
              {[...members, ...members].map((member, index) => (
                <article key={`${member.name}-${index}`} className="kts-member-card w-72 shrink-0 cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <img
                      src={member.image}
                      alt={`${member.name} member poster`}
                      className="kts-image-fill"
                      loading="lazy"
                    />
                    <div className="relative z-10 p-5">
                      <h3 className="font-display text-2xl text-foreground">{member.name}</h3>
                    </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kts-section border-b border-line/70">
        <div className="kts-container grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <p className="kts-eyebrow">Founders</p>
            <h2 className="kts-display text-3xl sm:text-4xl">The ones who started it.</h2>
            <p className="kts-copy mt-5">
              Every clan has its origin. KTS was built on the vision and energy of the people who laid the first stone.
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
            <img src={visuals.gym} alt="KTS gym environment exterior" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <p className="kts-eyebrow">KTS Boxing Beta Gym</p>
            <h2 className="kts-display text-3xl sm:text-4xl">Where we train and gather experiences.</h2>
            <p className="kts-copy mt-5">
              A place built for competition, growth, and community — where every session sharpens the signal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
