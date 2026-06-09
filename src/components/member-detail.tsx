import { Crown } from "lucide-react";

import {
  Dialog,
  DialogClose,
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
      <DialogContent className="max-w-2xl border-line/70 bg-panel p-0 sm:rounded-xl [&>button.absolute]:hidden">
        <DialogClose asChild>
          <button
            type="button"
            className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/60 text-foreground/70 transition-colors hover:bg-background/80 hover:text-foreground"
            aria-label="Close"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
            </svg>
          </button>
        </DialogClose>
        <div className="relative flex max-h-[65vh] min-h-[16rem] items-center justify-center overflow-hidden bg-background sm:min-h-[20rem]">
          <img
            src={member.image}
            alt={`${member.name} full graphic`}
            className="h-full w-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <Crown className="absolute right-4 top-4 h-6 w-6 text-accent/50" />
        </div>
        <div className="space-y-3 px-6 pb-6 sm:px-8 sm:pb-8">
          <div>
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
