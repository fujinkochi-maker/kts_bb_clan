import { Link, useRouter } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DiscordMemberCount } from "@/components/discord-member-count";
import { discordUrl, navigationItems, siteName, socialLinks, visuals } from "@/lib/kts-content";
import { ArrowRight, ArrowUp, Menu, X } from "lucide-react";

const socialIcon: Record<string, ReactNode> = {
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitch: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.428l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};

export function KtsShell({ children }: { children: ReactNode }) {
  const [scrollPct, setScrollPct] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setPageKey((k) => k + 1);
  }, [router.state.location.href]);

  useEffect(() => {
    function onScroll() {
      const pct = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      setScrollPct(Math.min(pct * 100, 100));
      setShowBackTop(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.state.location.href]);

  return (
    <div className="kts-page">
      <div
        className="fixed top-0 left-0 z-[100] h-[3px] bg-primary transition-[width] duration-100 ease-out"
        style={{ width: `${scrollPct}%` }}
      />

      <div aria-hidden="true" className="kts-ambient" />

      <header className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur-xl">
        <div className="kts-container flex items-center justify-between gap-3 py-3">
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center">
              <img src={visuals.logo} alt="KTS logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="kts-eyebrow">KTS</p>
              <p className="font-display text-sm text-foreground/90">{siteName}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "kts-nav-link kts-nav-link-active" }}
                inactiveProps={{ className: "kts-nav-link" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex">
            <a href={discordUrl} target="_blank" rel="noreferrer" className="kts-nav-link">
              Join Discord
            </a>
          </div>

          <button
            type="button"
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-md border border-line/70 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-line/70 bg-background/95 backdrop-blur-xl md:hidden">
            <nav className="kts-container flex flex-col gap-1 py-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "kts-nav-link kts-nav-link-active justify-start" }}
                  inactiveProps={{ className: "kts-nav-link justify-start" }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-line/50">
                <Button asChild className="kts-button-primary w-full">
                  <a href={discordUrl} target="_blank" rel="noreferrer">
                    Join Discord
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="animate-page-enter" key={pageKey}>{children}</main>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line/70 bg-panel/90 text-muted-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_24px_var(--color-glow)] ${
          showBackTop ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <footer className="border-t border-line/70 bg-gradient-to-b from-panel/20 to-panel/60">
        <div className="kts-container pt-12 pb-6">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center">
                  <img src={visuals.logo} alt="KTS logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="kts-eyebrow">KTS</p>
                  <p className="font-display text-sm text-foreground/90">{siteName}</p>
                </div>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Black-and-purple esports identity built around standout members, competitive energy, and
                a Discord-driven community that stays connected.
              </p>
            </div>

            <div>
              <p className="kts-eyebrow mb-4">Pages</p>
              <nav className="flex flex-col gap-2.5">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "text-sm text-foreground font-medium transition-colors" }}
                    inactiveProps={{ className: "text-sm text-muted-foreground transition-colors hover:text-foreground" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="kts-eyebrow mb-4">Community</p>
              <div className="flex flex-col gap-3">
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Discord server
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <Button asChild className="kts-button-primary mt-1 w-fit">
                  <a href={discordUrl} target="_blank" rel="noreferrer">
                    Join Discord
                  </a>
                </Button>
                <DiscordMemberCount />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-line/50 pt-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line/70 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_16px_var(--color-glow)]"
              >
                {socialIcon[link.icon]}
              </a>
            ))}
          </div>

          <div className="mt-8 border-t border-line/50 pt-6 text-center text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
