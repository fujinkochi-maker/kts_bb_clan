import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrackOverlay } from "@/components/crack-overlay";
import { visuals } from "@/lib/kts-content";
import {
  createServerFn,
  useServerFn,
} from "@tanstack/react-start";

interface DiscordUser {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string;
  discriminator: string;
  inGuild: boolean;
  joinedAt: string | null;
}

interface LoaderData {
  user: DiscordUser | null;
  error?: string;
}

const RANKS = [
  "Iron",
  "Silver",
  "Gold",
  "Emerald",
  "Diamond",
  "Platinum",
  "Master",
  "Void",
];

const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  const { verifySession } = await import("@/lib/api/discord-auth.server");
  const raw = getCookie("kts_session");
  const data = raw ? verifySession(decodeURIComponent(raw)) : null;
  return data
    ? {
        id: data.id as string,
        username: data.username as string,
        globalName: data.globalName as string | null,
        avatar: data.avatar as string,
        discriminator: data.discriminator as string,
        inGuild: data.inGuild as boolean,
        joinedAt: data.joinedAt as string | null,
      }
    : null;
});

export const Route = createFileRoute("/join")({
  loader: async (): Promise<LoaderData> => {
    const user = await getSession();
    return { user, error: undefined };
  },
  component: JoinPage,
});

const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((d: {
    robloxUser: string;
    rank: string;
    message: string;
    referredBy: string;
    screenshotBase64: string;
    screenshotName: string;
    discordTag: string;
    discordId: string;
    inGuild: boolean;
  }) => d)
  .handler(async ({ data }) => {
    const { webhookUrl2 } = await import(
      "@/lib/config.server"
    ).then((m) => m.getServerConfig().discord);

    if (!webhookUrl2) {
      return { ok: false, error: "Webhook not configured" };
    }

    const components = [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: "Accept",
            style: 3,
            custom_id: "kts_app_accept",
          },
          {
            type: 2,
            label: "Deny",
            style: 4,
            custom_id: "kts_app_deny",
          },
        ],
      },
    ];

    const embed = {
      title: "📬 New Application",
      color: 0x9b59b6,
      fields: [
        {
          name: "Discord",
          value: `${data.discordTag} (${data.discordId})`,
          inline: true,
        },
        { name: "Server Member", value: data.inGuild ? "✅ Yes" : "❌ No", inline: true },
        { name: "Roblox Username", value: data.robloxUser, inline: true },
        { name: "Claimed Rank", value: data.rank, inline: true },
        { name: "Referred By", value: data.referredBy || "—", inline: true },
        { name: "Why Join", value: data.message || "—" },
      ],
      footer: { text: "KTS Clan — Applications" },
      timestamp: new Date().toISOString(),
    };

    const payload = { embeds: [embed], components };

    if (data.screenshotBase64) {
      const buf = Buffer.from(data.screenshotBase64, "base64");
      const form = new FormData();
      const blob = new Blob([buf], { type: "image/png" });
      form.append(
        "file",
        blob,
        data.screenshotName || "screenshot.png",
      );
      form.append("payload_json", JSON.stringify(payload));

      const res = await fetch(webhookUrl2, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        return { ok: false, error: `Discord returned ${res.status}: ${text}` };
      }
    } else {
      const res = await fetch(webhookUrl2, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        return { ok: false, error: `Discord returned ${res.status}: ${text}` };
      }
    }

    return { ok: true, error: null };
  });

function JoinPage() {
  const { user, error } = Route.useLoaderData();
  const router = useRouter();
  const submit = useServerFn(submitApplication);

  const [robloxUser, setRobloxUser] = useState("");
  const [rank, setRank] = useState("");
  const [message, setMessage] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast("Please login with Discord first.");
      return;
    }

    if (!robloxUser.trim()) {
      toast("Please enter your Roblox username.");
      return;
    }

    if (!rank) {
      toast("Please select your rank.");
      return;
    }

    setSubmitting(true);

    let screenshotBase64 = "";
    let screenshotName = "";
    if (screenshot) {
      screenshotName = screenshot.name;
      screenshotBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(screenshot);
      });
    }

    try {
      const result = await submit({
        data: {
          robloxUser: robloxUser.trim(),
          rank,
          message: message.trim(),
          referredBy: referredBy.trim(),
          screenshotBase64,
          screenshotName,
          discordTag: user.globalName || user.username,
          discordId: user.id,
          inGuild: user.inGuild,
        },
      });

      if (result.ok) {
        toast("Application submitted! We'll reach out on Discord.");
        setRobloxUser("");
        setRank("");
        setMessage("");
        setReferredBy("");
        setScreenshot(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast(result.error || "Something went wrong.");
      }
    } catch {
      toast("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
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
          <div className="kts-container relative grid gap-10 py-16 lg:py-24">
            <div className="animate-fade-in-up pl-6 sm:pl-10 lg:pl-16 max-w-2xl">
              <p className="kts-eyebrow">Join KTS</p>
              <h1 className="kts-display text-5xl sm:text-6xl lg:text-7xl">
                Apply to the clan.
              </h1>
              <p className="kts-copy mt-6 text-lg sm:text-xl">
                Login with Discord to verify your identity and apply.
              </p>
              <div className="mt-8">
                <Button asChild className="kts-button-primary">
                  <a
                    href="/auth/discord"
                    className="inline-flex items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    Login with Discord
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
        <div className="kts-container relative py-16 lg:py-24">
          <div className="mx-auto max-w-2xl animate-fade-in-up">
            <p className="kts-eyebrow pl-6 sm:pl-10">Join KTS</p>
            <h1 className="kts-display pl-6 sm:pl-10 text-4xl sm:text-5xl lg:text-6xl">
              Application Form
            </h1>

            <div className="mt-8 kts-surface p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                <img
                  src={user.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {user.globalName || user.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.inGuild
                      ? "✅ KTS Server Member"
                      : "❌ Not in KTS Server — join first at /discord-community"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="roblox">Roblox Username</Label>
                  <Input
                    id="roblox"
                    value={robloxUser}
                    onChange={(e) => setRobloxUser(e.target.value)}
                    placeholder="xX_KTS_Delay_Xx"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rank">Boxing Beta Rank</Label>
                  <Select value={rank} onValueChange={setRank} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {RANKS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">
                    Rank Screenshot{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    ref={fileRef}
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a screenshot proving your rank so leadership can verify.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Why do you want to join KTS?{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {message.length} / 1000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referred">
                    Referred by{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="referred"
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                    placeholder="KTS Ramboo"
                  />
                </div>

                <Button
                  type="submit"
                  className="kts-button-primary w-full"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
