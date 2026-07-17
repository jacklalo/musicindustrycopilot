import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Bell,
  Play,
  Sparkles,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  UserCircle2,
  Check,
  Music,
} from "lucide-react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROSTER } from "@/lib/roster";
import { usePlayer } from "@/components/player/PlayerProvider";

const NAV = [
  { to: "/", label: "Charts" },
  { to: "/roster", label: "Roster" },
  { to: "/tours", label: "Tours" },
  { to: "/insights", label: "Insights" },
] as const;

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { play } = usePlayer();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="flex items-baseline gap-1.5 transition-opacity hover:opacity-80"
          >
            <span className="display-tight text-xl">#NP</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Intelligence
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-[13px] font-medium md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                className="relative rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:text-foreground"
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={
                        "pointer-events-none absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-[color:var(--pop)] transition-transform duration-300 " +
                        (isActive ? "scale-x-100" : "scale-x-0")
                      }
                    />
                  </>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Recherche (⌘K)"
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-full border border-line bg-card pl-3 pr-2 text-[12px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:inline-flex"
          >
            <Search className="size-3.5" strokeWidth={2.25} />
            <span>Rechercher</span>
            <kbd className="ml-2 rounded border border-line bg-background px-1.5 py-px text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          <button
            aria-label="Recherche"
            onClick={() => setSearchOpen(true)}
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:hidden"
          >
            <Search className="size-4" strokeWidth={2.25} />
          </button>

          <AlertsPopover />

          <ProfileMenu />
        </div>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Chercher un artiste, un titre, une ville…" />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          <CommandGroup heading="Artistes">
            {ROSTER.slice(0, 8).map((a) => (
              <CommandItem
                key={a.slug}
                value={`${a.name} ${a.track} ${a.city} ${a.genre}`}
                onSelect={() => {
                  setSearchOpen(false);
                  navigate({ to: "/artists/$slug", params: { slug: a.slug } });
                }}
                className="flex items-center gap-3"
              >
                <img
                  src={a.cover}
                  alt=""
                  className="size-8 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{a.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {a.track} · {a.genre}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchOpen(false);
                    play(a);
                  }}
                  className="grid size-7 place-items-center rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover:opacity-100 data-[selected=true]:opacity-100"
                  aria-label={`Lire ${a.track}`}
                >
                  <Play className="size-3 fill-current" strokeWidth={0} />
                </button>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                setSearchOpen(false);
                navigate({ to: "/roster" });
              }}
            >
              <Music className="mr-2 size-4" /> Roster complet
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setSearchOpen(false);
                navigate({ to: "/tours" });
              }}
            >
              <Calendar className="mr-2 size-4" /> Agenda tournées
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setSearchOpen(false);
                navigate({ to: "/insights" });
              }}
            >
              <Sparkles className="mr-2 size-4" /> Insights IA
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}

/* -------------------- ALERTS -------------------- */

type Alert = {
  id: string;
  kicker: string;
  title: string;
  accent: string;
  time: string;
  icon: React.ReactNode;
};

const ALERTS: Alert[] = [
  {
    id: "1",
    kicker: "Viral",
    title: "Hina ‘Fantaisie’ entre dans le Top 50 Viral France",
    accent: "#ED2362",
    time: "il y a 4 min",
    icon: <Sparkles className="size-3.5" />,
  },
  {
    id: "2",
    kicker: "Streaming",
    title: "Zazie · « Peu Importe » +12% (seuil alerte +20% approche)",
    accent: "#C8102E",
    time: "il y a 1 h",
    icon: <TrendingUp className="size-3.5" />,
  },
  {
    id: "3",
    kicker: "Playlist",
    title: "Jérémy Frerot entré en playlist >100k followers",
    accent: "#5A8DB8",
    time: "ce matin",
    icon: <Calendar className="size-3.5" />,
  },
];

function AlertsPopover() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const remaining = ALERTS.filter((a) => !dismissed[a.id]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Alertes"
          className="relative hidden h-9 items-center gap-2 rounded-full bg-foreground px-3.5 text-[12px] font-semibold text-background transition-all hover:scale-[1.03] hover:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.4)] sm:inline-flex"
        >
          <Bell className="size-3.5" strokeWidth={2.5} />
          <span>{remaining.length} Alerts</span>
          {remaining.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[color:var(--pop)] ring-2 ring-background" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[360px] rounded-2xl border border-line p-0 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Alertes
            </p>
            <p className="text-[13px] font-semibold">
              {remaining.length} signaux à examiner
            </p>
          </div>
          <button
            onClick={() => {
              setDismissed(Object.fromEntries(ALERTS.map((a) => [a.id, true])));
              toast("Toutes les alertes archivées");
            }}
            className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            Tout marquer lu
          </button>
        </div>
        <div className="max-h-[360px] overflow-y-auto border-t border-line">
          {remaining.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Check className="size-5 text-emerald-600" />
              <p className="text-[13px] font-semibold">Tout est à jour</p>
              <p className="text-[11px] text-muted-foreground">
                Aucun signal critique pour l'instant.
              </p>
            </div>
          ) : (
            remaining.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setOpen(false);
                  toast(`Alerte ouverte · ${a.kicker}`);
                }}
                className="group flex w-full items-start gap-3 border-b border-line px-4 py-3 text-left transition-colors hover:bg-[color:var(--surface)] last:border-0"
              >
                <span
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full"
                  style={{ background: a.accent + "1A", color: a.accent }}
                >
                  {a.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: a.accent }}
                  >
                    {a.kicker}
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium leading-snug">
                    {a.title}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{a.time}</p>
                </div>
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDismissed((d) => ({ ...d, [a.id]: true }));
                  }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                >
                  Archiver
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* -------------------- PROFILE -------------------- */

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Profil"
          className="grid size-9 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background ring-2 ring-transparent transition-all hover:ring-[color:var(--pop)]/30 focus-visible:outline-none focus-visible:ring-[color:var(--pop)]/50"
        >
          PN
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 rounded-2xl border-line p-2"
      >
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="grid size-10 place-items-center rounded-full bg-foreground text-[12px] font-bold text-background">
            PN
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">Pauline N.</p>
            <p className="truncate text-[11px] text-muted-foreground">
              A&R · Hashtag NP
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Compte
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast("Profil — bientôt disponible")}>
          <UserCircle2 className="mr-2 size-4" /> Mon profil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast("Paramètres — bientôt disponibles")}>
          <Settings className="mr-2 size-4" /> Paramètres
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => toast("À bientôt 👋")}
          className="text-rose-600 focus:text-rose-700"
        >
          <LogOut className="mr-2 size-4" /> Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-[var(--ink)] text-white/70">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center lg:px-12">
        <div className="flex items-baseline gap-2">
          <span className="display-tight text-lg text-white">#NP</span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/50">
            Intelligence · v0.3
          </span>
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          © Hashtag NP · Live Nation France · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
