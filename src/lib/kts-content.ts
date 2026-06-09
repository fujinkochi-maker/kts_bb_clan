import bannerUrl from "@/assets/ktsBanner.jpg";
import delayUrl from "@/assets/ktsDelay.png";
import gymUrl from "@/assets/ktsGym.png";
import logoUrl from "@/assets/ktsLogo.png";
import maddyUrl from "@/assets/ktsMaddy.webp";
import rambooUrl from "@/assets/ktsRamboo.png";
import remainUrl from "@/assets/ktsRemain.png";
import rxtchettUrl from "@/assets/ktsRxtchett.png";
import splurrUrl from "@/assets/ktsSplurr.webp";
import sunUrl from "@/assets/ktsSun.png";

export const discordUrl = "https://discord.gg/wsf77h7Fmn";

export const siteName = "KTS Clan";

export const aboutPlaceholder = [
  "KTS moves with a competitive edge, a cinematic identity, and a community-first mindset.",
  "Your official About Us text will drop here once you send it.",
];

export const navigationItems = [
  { label: "Home", to: "/" as const },
  { label: "About Us", to: "/about" as const },
  { label: "Discord Community", to: "/discord-community" as const },
];

export const members = [
  {
    name: "Delay",
    role: "Delayed",
    tagline: "Bro is Delayed",
    image: delayUrl,
  },
  {
    name: "Maddy",
    role: "Champion energy",
    tagline: "Bright confidence with headline impact.",
    image: maddyUrl,
  },
  {
    name: "Ramboo",
    role: "Night runner",
    tagline: "Cold atmosphere and late-hour style.",
    image: rambooUrl,
  },
  {
    name: "Remains",
    role: "Arena focus",
    tagline: "High-voltage pressure built for the spotlight.",
    image: remainUrl,
  },
  {
    name: "Rxtchett",
    role: "Founder / Content Creator",
    tagline: "Built different, Follow Rxcthett!",
    image: rxtchettUrl,
  },
  {
    name: "Splurr",
    role: "Splurred",
    tagline: "Dark, aggressive, and impossible to ignore.",
    image: splurrUrl,
  },
  {
    name: "Sun",
    role: "Inferno mode",
    tagline: "Pure heat, pure motion, pure impact.",
    image: sunUrl,
  },
];

export const featuredMembers = members.slice(0, 3);

export const founders = [
  {
    name: "Rxtchett",
    role: "Founder / Content Creator",
    tagline: "Built different, Follow Rxcthett!",
    image: rxtchettUrl,
  },
  {
    name: "K3",
    role: "Founder",
    tagline: "",
    image: undefined,
  },
];

export const communityPillars = [
  {
    title: "Active Discord",
    text: "Jump into the server for daily chat, callouts, reactions, and real-time community energy.",
  },
  {
    title: "Member Identity",
    text: "Each member brings a distinct visual lane, making KTS feel like a roster instead of a random group.",
  },
  {
    title: "Competitive Presence",
    text: "The brand language is built to feel sharp, loud, and ready for clips, edits, events, and showcases.",
  },
];

export const visuals = {
  banner: bannerUrl,
  gym: gymUrl,
  logo: logoUrl,
};

export const socialLinks = [
  { label: "Twitter", href: "https://x.com/KTSClan", icon: "twitter" },
  { label: "Instagram", href: "https://instagram.com/KTSClan", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCgzTqhCy0uMlr4qycLlCRHQ", icon: "youtube" },
  { label: "Twitch", href: "https://twitch.tv/KTSClan", icon: "twitch" },
  { label: "TikTok", href: "https://www.tiktok.com/@rxtchetyt", icon: "tiktok" },
] as const;
