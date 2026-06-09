import { useEffect, useState } from "react";
import { Users } from "lucide-react";

const INVITE_CODE = "wsf77h7Fmn";

export function DiscordMemberCount() {
  const [count, setCount] = useState<number | null>(null);
  const [online, setOnline] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      try {
        const res = await fetch(
          `https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`,
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setCount(data.approximate_member_count ?? null);
          setOnline(data.approximate_presence_count ?? null);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error || (count === null && online === null)) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-muted-foreground">
          {online ?? "?"} online
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">
          {count ?? "?"} members
        </span>
      </div>
    </div>
  );
}
