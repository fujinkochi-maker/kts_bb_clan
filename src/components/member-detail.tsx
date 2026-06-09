import { Crown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface MemberDetailProps {
  member: {
    name: string;
    role: string;
    tagline: string;
    image: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberDetail({ member, open, onOpenChange }: MemberDetailProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-line/70 bg-panel p-0 sm:rounded-xl">
        <div className="relative min-h-[20rem] overflow-hidden sm:min-h-[24rem]">
          <img
            src={member.image}
            alt={`${member.name} full graphic`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <Crown className="absolute right-4 top-4 h-6 w-6 text-accent/50" />
        </div>
        <div className="space-y-3 px-6 pb-6 sm:px-8 sm:pb-8">
          <div>
            <p className="kts-eyebrow">{member.role}</p>
            <DialogTitle className="font-display text-3xl text-foreground sm:text-4xl">
              {member.name}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-muted-foreground">
            {member.tagline}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
