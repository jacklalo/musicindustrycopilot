import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  X,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { ROSTER, type Artist } from "@/lib/roster";

type PlayerState = {
  current: Artist | null;
  playing: boolean;
  progress: number; // 0-100
  liked: Record<string, boolean>;
};

type PlayerCtx = {
  state: PlayerState;
  play: (artist: Artist) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  toggleLike: (slug: string) => void;
};

const Ctx = createContext<PlayerCtx | null>(null);

export function usePlayer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePlayer must be used inside PlayerProvider");
  return v;
}

const DURATION_SEC = 38; // simulated playthrough

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    current: null,
    playing: false,
    progress: 0,
    liked: {},
  });
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.playing) return;
    const id = window.setInterval(() => {
      setState((s) => {
        const next = s.progress + 100 / (DURATION_SEC * 4);
        if (next >= 100) {
          // auto-advance
          const idx = ROSTER.findIndex((a) => a.slug === s.current?.slug);
          const nx = ROSTER[(idx + 1) % ROSTER.length];
          return { ...s, current: nx, progress: 0 };
        }
        return { ...s, progress: next };
      });
    }, 250);
    tickRef.current = id;
    return () => window.clearInterval(id);
  }, [state.playing]);

  const play: PlayerCtx["play"] = (artist) => {
    setState((s) => ({
      ...s,
      current: artist,
      playing: true,
      progress: s.current?.slug === artist.slug ? s.progress : 0,
    }));
    toast(`Lecture · ${artist.track}`, {
      description: `${artist.name} · ${artist.album}`,
    });
  };

  const toggle = () => setState((s) => ({ ...s, playing: !s.playing }));

  const step = (dir: 1 | -1) =>
    setState((s) => {
      if (!s.current) return s;
      const idx = ROSTER.findIndex((a) => a.slug === s.current!.slug);
      const nx = ROSTER[(idx + dir + ROSTER.length) % ROSTER.length];
      return { ...s, current: nx, progress: 0, playing: true };
    });

  const next = () => step(1);
  const prev = () => step(-1);

  const stop = () =>
    setState((s) => ({ ...s, playing: false, current: null, progress: 0 }));

  const toggleLike = (slug: string) =>
    setState((s) => {
      const liked = { ...s.liked, [slug]: !s.liked[slug] };
      toast(liked[slug] ? "Ajouté aux favoris" : "Retiré des favoris");
      return { ...s, liked };
    });

  return (
    <Ctx.Provider value={{ state, play, toggle, next, prev, stop, toggleLike }}>
      {children}
      <MiniPlayer />
    </Ctx.Provider>
  );
}

function fmt(pct: number) {
  const sec = Math.floor((pct / 100) * DURATION_SEC);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function MiniPlayer() {
  const { state, toggle, next, prev, stop, toggleLike } = usePlayer();
  const a = state.current;
  if (!a) return null;
  const liked = !!state.liked[a.slug];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-3 sm:px-6 sm:pb-5">
      <div
        className="pointer-events-auto flex w-full max-w-[1100px] items-center gap-4 rounded-2xl border border-white/10 bg-[var(--ink)]/95 px-3 py-2.5 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{
          boxShadow: `0 30px 80px -20px ${a.accent}66, 0 0 0 1px rgba(255,255,255,0.04)`,
        }}
      >
        <Link
          to="/artists/$slug"
          params={{ slug: a.slug }}
          className="group flex min-w-0 flex-1 items-center gap-3"
        >
          <span className="relative shrink-0">
            <img
              src={a.cover}
              alt=""
              className="size-11 rounded-md object-cover ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105"
            />
            <span
              className="absolute inset-0 rounded-md ring-1"
              style={{ boxShadow: `0 0 18px ${a.accent}66`, borderColor: a.accent }}
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight transition-colors group-hover:text-white">
              {a.track}
            </p>
            <p className="truncate text-[11px] text-white/55">
              {a.name} · {a.album}
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <PlayerBtn onClick={prev} label="Précédent">
            <SkipBack className="size-4 fill-current" strokeWidth={0} />
          </PlayerBtn>
          <button
            aria-label={state.playing ? "Pause" : "Lecture"}
            onClick={toggle}
            className="grid size-10 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95"
            style={{ boxShadow: `0 6px 24px -8px ${a.accent}` }}
          >
            {state.playing ? (
              <Pause className="size-4 fill-current" strokeWidth={0} />
            ) : (
              <Play className="size-4 translate-x-px fill-current" strokeWidth={0} />
            )}
          </button>
          <PlayerBtn onClick={next} label="Suivant">
            <SkipForward className="size-4 fill-current" strokeWidth={0} />
          </PlayerBtn>
        </div>

        <div className="hidden flex-1 items-center gap-3 md:flex">
          <span className="tabular text-[10px] text-white/55">{fmt(state.progress)}</span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <span
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-200 ease-linear"
              style={{ width: `${state.progress}%`, background: a.accent }}
            />
          </div>
          <span className="tabular text-[10px] text-white/55">0:{DURATION_SEC}</span>
        </div>

        <div className="flex items-center gap-1">
          <PlayerBtn onClick={() => toggleLike(a.slug)} label="Favori">
            <Heart
              className={"size-4 transition-colors " + (liked ? "" : "")}
              strokeWidth={2}
              fill={liked ? a.accent : "none"}
              color={liked ? a.accent : "currentColor"}
            />
          </PlayerBtn>
          <PlayerBtn onClick={() => {}} label="Volume" className="hidden sm:grid">
            <Volume2 className="size-4" strokeWidth={2} />
          </PlayerBtn>
          <PlayerBtn onClick={stop} label="Fermer">
            <X className="size-4" strokeWidth={2.25} />
          </PlayerBtn>
        </div>
      </div>
    </div>
  );
}

function PlayerBtn({
  children,
  onClick,
  label,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={
        "grid size-9 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white " +
        className
      }
    >
      {children}
    </button>
  );
}
