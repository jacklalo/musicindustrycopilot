import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Play,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  ArrowUp,
  Download,
  Heart,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { TopNav, Footer } from "@/components/TopNav";
import { usePlayer } from "@/components/player/PlayerProvider";
import { ROSTER, LABELS, type Artist, type LabelId } from "@/lib/roster";

type TabId = "top" | "viral" | "rising" | "catalogue";
const TABS: { id: TabId; label: string }[] = [
  { id: "top", label: "Top Roster" },
  { id: "viral", label: "Viral" },
  { id: "rising", label: "Rising" },
  { id: "catalogue", label: "Catalogue" },
];

type LabelFilter = "all" | LabelId;

function filterArtists(tab: TabId, label: LabelFilter, artists: Artist[]) {
  const scoped = label === "all" ? artists : artists.filter((a) => a.label === label);
  switch (tab) {
    case "viral":
      return scoped.filter((a) => a.status === "viral");
    case "rising":
      return scoped.filter((a) => a.status === "rising");
    case "catalogue":
      return [...scoped].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return scoped;
  }
}

function exportCsv(artists: Artist[]) {
  const header = ["rank", "name", "track", "genre", "country", "streams", "delta", "status"];
  const rows = artists.map((a) =>
    [a.rank, a.name, a.track, a.genre, a.country, a.streams, a.delta, a.status]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  const blob = new Blob([header.join(",") + "\n" + rows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `np-roster-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast(`Export prêt — ${artists.length} artistes`, {
    description: a.download,
  });
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "#NP Intelligence — Charts" },
      {
        name: "description",
        content:
          "Charts hebdomadaires du roster Hashtag NP : streaming, social, live. Toute l'intelligence artiste en un seul endroit.",
      },
      { property: "og:title", content: "#NP Intelligence — Charts" },
      {
        property: "og:description",
        content: "Streaming, social, tour analytics for the #NP roster.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const featured = ROSTER[0];
  const [tab, setTab] = useState<TabId>("top");
  const [label, setLabel] = useState<LabelFilter>("all");
  const filtered = useMemo(() => filterArtists(tab, label, ROSTER), [tab, label]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <AskIntro />
      <Hero featured={featured} />
      <main className="mx-auto max-w-[1440px] px-6 pb-32 lg:px-12">

        <Toolbar
          tab={tab}
          onTabChange={setTab}
          label={label}
          onLabelChange={setLabel}
          onExport={() => exportCsv(filtered)}
        />
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <Leaderboard artists={filtered} />
          </section>
          <aside className="lg:col-span-4">
            <FeaturedPanel artist={featured} />
          </aside>
        </div>
        <InsightsRow />
      </main>
      <Footer />
    </div>
  );
}

/* -------------------- ASK INTRO -------------------- */

const QUICK_PROMPTS = [
  "Quel artiste accélère cette semaine ?",
  "Compare Zazie et Jérémy Frerot sur 30 jours",
  "Où booker Skip the Use en tournée ?",
  "Alertes streaming des 7 derniers jours",
  "Résume la performance du label 6&7",
];

function AskIntro() {
  const [value, setValue] = useState("");
  const submit = (q: string) => {
    const query = q.trim();
    if (!query) return;
    toast("Question envoyée à #NP Intelligence", {
      description: query,
    });
    setValue("");
  };
  return (
    <section className="relative border-b border-line bg-background">
      <div className="mx-auto max-w-[900px] px-6 py-20 lg:py-28">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/50">
            <Sparkles className="size-3" />
            #NP Intelligence
          </div>
          <h2 className="display-tight text-[clamp(32px,5vw,56px)] leading-[1.02] text-balance">
            Demandez n'importe quoi<br />sur votre roster.
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
            className="w-full"
          >
            <div className="group relative flex items-center rounded-2xl border border-line bg-card px-2 py-2 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all focus-within:border-foreground/40 focus-within:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)]">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Posez une question à #NP Intelligence…"
                className="flex-1 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!value.trim()}
                className="grid size-10 place-items-center rounded-xl bg-[var(--ink)] text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
                aria-label="Envoyer"
              >
                <ArrowUp className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          </form>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => submit(q)}
                className="rounded-full border border-line bg-card px-4 py-2 text-xs font-medium text-foreground/70 transition-all hover:border-foreground/30 hover:bg-foreground/[0.03] hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- HERO -------------------- */

function Hero({ featured }: { featured: Artist }) {

  const { play } = usePlayer();
  return (
    <section className="relative overflow-hidden border-b border-line bg-[var(--ink)] text-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 lg:px-12 lg:py-24">
        <div className="md:col-span-7 flex flex-col gap-7">
          <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
            <span className="size-1.5 rounded-full bg-[color:var(--pop)] shadow-[0_0_12px_var(--pop)]" />
            Live Roster — Semaine 48
          </div>
          <h1 className="display-tight text-[clamp(48px,8vw,112px)] leading-[0.92] text-balance">
            Top <span className="italic text-white/60">14</span>
            <br />
            Hashtag&nbsp;NP.
          </h1>
          <p className="max-w-[52ch] text-base text-white/65 text-pretty">
            Les artistes qui font bouger la semaine — vélocité streaming, pulsation
            sociale, chaleur live, sur l'ensemble du catalogue managé.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => play(featured)}
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-white pl-2 pr-5 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.5)]"
            >
              <span className="grid size-9 place-items-center rounded-full bg-[var(--ink)] text-white transition-colors group-hover:bg-[color:var(--pop)]">
                <Play className="size-4 fill-current" strokeWidth={0} />
              </span>
              Lancer la radio roster
            </button>
            <a
              href="#chart"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-white/80 transition-all hover:scale-[1.02] hover:border-white/30 hover:bg-white/5"
            >
              Voir le chart <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="md:col-span-5 relative h-[280px] sm:h-[360px] md:h-auto">
          <CollageCard
            src={featured.cover}
            accent={featured.accent}
            className="absolute right-[8%] top-[8%] size-[58%] rotate-[8deg]"
            featured
          />
          <CollageCard
            src={ROSTER[2].cover}
            accent={ROSTER[2].accent}
            className="absolute right-[40%] top-[28%] size-[42%] rotate-[-12deg]"
          />
          <CollageCard
            src={ROSTER[4].cover}
            accent={ROSTER[4].accent}
            className="absolute right-[2%] bottom-[6%] size-[38%] rotate-[18deg]"
          />
        </div>
      </div>
    </section>
  );
}

function CollageCard({
  src,
  accent,
  className,
  featured,
}: {
  src: string;
  accent: string;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div className={`${className} group`}>
      <div
        className="relative size-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:rotate-0"
        style={{ boxShadow: `0 30px 80px -20px ${accent}55` }}
      >
        <img src={src} alt="" loading="lazy" className="size-full object-cover" />
        {featured && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            <span className="size-1.5 rounded-full" style={{ background: accent }} />
            #1 cette semaine
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- TOOLBAR -------------------- */

function Toolbar({
  tab,
  onTabChange,
  label,
  onLabelChange,
  onExport,
}: {
  tab: TabId;
  onTabChange: (t: TabId) => void;
  label: LabelFilter;
  onLabelChange: (l: LabelFilter) => void;
  onExport: () => void;
}) {
  const LABEL_CHIPS: { id: LabelFilter; label: string }[] = [
    { id: "all", label: "Tous les labels" },
    ...LABELS.map((l) => ({ id: l.id as LabelFilter, label: l.short })),
  ];
  return (
    <div
      id="chart"
      className="flex flex-col gap-4 pt-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filtres roster"
          className="flex flex-wrap items-center gap-2"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange(t.id)}
                className={
                  "h-9 cursor-pointer rounded-full px-4 text-[12px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                  (active
                    ? "bg-foreground text-background shadow-[0_6px_20px_-10px_rgba(0,0,0,0.4)]"
                    : "border border-line text-muted-foreground hover:-translate-y-px hover:border-foreground/40 hover:text-foreground")
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Sync il y a 4 min
          </span>
          <span className="size-1 rounded-full bg-line" />
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-[color:var(--pop)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Label
        </span>
        {LABEL_CHIPS.map((l) => {
          const active = label === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onLabelChange(l.id)}
              aria-pressed={active}
              className={
                "h-8 cursor-pointer rounded-full px-3.5 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 " +
                (active
                  ? "bg-foreground text-background"
                  : "border border-line text-muted-foreground hover:border-foreground/40 hover:text-foreground")
              }
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- LEADERBOARD -------------------- */

function Leaderboard({ artists }: { artists: Artist[] }) {
  return (
    <div className="mt-2">
      <div className="grid grid-cols-12 gap-4 border-b border-line pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Artiste / Titre</div>
        <div className="col-span-2 hidden md:block">Momentum</div>
        <div className="col-span-2 text-right">Streams</div>
        <div className="col-span-2 text-right">Δ 7j</div>
      </div>
      {artists.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-[color:var(--surface)] py-16 text-center">
          <p className="text-sm font-semibold">Aucun artiste dans ce filtre</p>
          <p className="text-[12px] text-muted-foreground">
            Essaie un autre onglet — le signal évolue chaque heure.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {artists.map((a) => (
            <ArtistRow key={a.slug} a={a} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ArtistRow({ a }: { a: Artist }) {
  const navigate = useNavigate();
  const { play } = usePlayer();
  const rankDelta = a.prev - a.rank;
  const goToArtist = () => navigate({ to: "/artists/$slug", params: { slug: a.slug } });
  return (
    <li
      role="link"
      tabIndex={0}
      onClick={goToArtist}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToArtist();
        }
      }}
      className="group relative grid cursor-pointer grid-cols-12 items-center gap-4 rounded-2xl border border-transparent px-3 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:bg-foreground/[0.04] hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:border-foreground/20 focus-visible:ring-2 focus-visible:ring-foreground/20"
      style={{ ["--row-accent" as string]: a.accent }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-full transition-transform duration-300 group-hover:scale-y-100"
        style={{ background: a.accent }}
      />
      <div className="col-span-1 flex items-center gap-2">
        <span className="tabular text-base font-semibold">
          {String(a.rank).padStart(2, "0")}
        </span>
        <RankArrow delta={rankDelta} />
      </div>

      <div className="col-span-5 flex items-center gap-4">
        <span className="relative shrink-0">
          <img
            src={a.cover}
            alt=""
            loading="lazy"
            width={56}
            height={56}
            className="size-14 rounded-lg object-cover ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-[1.06] group-hover:shadow-[0_10px_24px_-12px_var(--row-accent)]"
          />
          <button
            aria-label={`Lire ${a.track}`}
            onClick={(e) => {
              e.stopPropagation();
              play(a);
            }}
            className="absolute inset-0 m-auto grid size-8 translate-y-1 place-items-center rounded-full bg-white/95 opacity-0 shadow-lg ring-1 ring-black/10 transition-all duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--row-accent)]"
          >
            <Play className="size-3.5 fill-black" strokeWidth={0} />
          </button>
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight transition-colors group-hover:text-foreground">
            {a.track}
          </p>
          <p className="truncate text-[12px] text-muted-foreground">
            <span className="font-medium text-foreground/80">{a.name}</span>
            <span className="mx-1.5 text-line">·</span>
            {a.genre}
            <span className="mx-1.5 text-line">·</span>
            <span className="tabular">{a.country}</span>
          </p>
        </div>
      </div>

      <div className="col-span-2 hidden md:block">
        <Sparkline status={a.status} delta={a.delta} />
      </div>

      <div className="col-span-2 text-right">
        <p className="tabular text-[14px] font-semibold">{a.streams}</p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          listeners
        </p>
      </div>

      <div className="col-span-2 flex items-center justify-end gap-2">
        <DeltaBadge delta={a.delta} status={a.status} />
        <RowActions artist={a} />
      </div>
    </li>
  );
}


function RowActions({ artist }: { artist: Artist }) {
  const { play, toggleLike, state } = usePlayer();
  const liked = !!state.liked[artist.slug];
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Actions"
          onClick={(e) => e.stopPropagation()}
          className="grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 data-[state=open]:bg-secondary data-[state=open]:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl border-line"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onSelect={() => play(artist)}>
          <Play className="mr-2 size-4" /> Lire {artist.track}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            navigate({ to: "/artists/$slug", params: { slug: artist.slug } })
          }
        >
          <ArrowUpRight className="mr-2 size-4" /> Ouvrir la fiche
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toggleLike(artist.slug)}>
          <Heart
            className="mr-2 size-4"
            fill={liked ? "currentColor" : "none"}
          />
          {liked ? "Retirer favoris" : "Ajouter favoris"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            navigator.clipboard
              ?.writeText(`${window.location.origin}/artists/${artist.slug}`)
              .catch(() => {});
            toast("Lien copié");
          }}
        >
          <Share2 className="mr-2 size-4" /> Copier le lien
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RankArrow({ delta }: { delta: number }) {
  if (delta === 0)
    return <span className="text-[10px] font-bold text-muted-foreground">—</span>;
  if (delta > 0)
    return (
      <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
        <TrendingUp className="size-3" strokeWidth={2.5} />
        {delta}
      </span>
    );
  return (
    <span className="inline-flex items-center text-[10px] font-bold text-rose-600">
      <TrendingDown className="size-3" strokeWidth={2.5} />
      {Math.abs(delta)}
    </span>
  );
}

type Trend = {
  angle: number;
  color: string;
  label: string;
};

function getTrend(status: Artist["status"], delta: number): Trend {
  if (status === "viral") return { angle: -90, color: "#16a34a", label: "Viral" };
  if (status === "rising") return { angle: -45, color: "#2563eb", label: "Rising" };
  if (status === "drop") {
    return delta <= -10
      ? { angle: 90, color: "#dc2626", label: "En chute" }
      : { angle: 45, color: "#ea580c", label: "Baisse" };
  }
  return { angle: 0, color: "#9ca3af", label: "Stable" };
}

function DeltaBadge({
  delta,
  status,
}: {
  delta: number;
  status: Artist["status"];
}) {
  const trend = getTrend(status, delta);
  const positive = delta >= 0;
  return (
    <div
      className="hidden items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline-flex"
      style={{
        borderColor: trend.color + "55",
        background: trend.color + "14",
        color: trend.color,
      }}
    >
      <span className="tabular">
        {positive ? "+" : ""}
        {delta.toFixed(1)}%
      </span>
      <span className="hidden md:inline">{trend.label}</span>
    </div>
  );
}

function Sparkline({
  status,
  delta,
}: {
  status: Artist["status"];
  delta: number;
}) {
  const trend = getTrend(status, delta);
  return (
    <div className="flex h-9 items-center" aria-label={trend.label} title={trend.label}>
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        style={{ transform: `rotate(${trend.angle}deg)`, color: trend.color }}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="13,6 19,12 13,18" />
      </svg>
    </div>
  );
}


/* -------------------- FEATURED PANEL -------------------- */

function FeaturedPanel({ artist }: { artist: Artist }) {
  const { play } = usePlayer();
  return (
    <div className="sticky top-24 overflow-hidden rounded-3xl border border-line bg-card transition-shadow hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.4)]">
      <div className="group relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={artist.cover}
          alt=""
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <button
          onClick={() => play(artist)}
          aria-label={`Lire ${artist.track}`}
          className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/95 text-black opacity-0 shadow-xl ring-1 ring-black/10 transition-all duration-300 hover:scale-110 group-hover:opacity-100"
        >
          <Play className="size-5 fill-current" strokeWidth={0} />
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 text-white">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ background: artist.accent + "EE", color: "#fff" }}
          >
            #1 Now
          </span>
          <h3 className="display-tight mt-4 text-4xl leading-[0.95]">{artist.track}</h3>
          <p className="mt-1 text-sm text-white/75">
            {artist.name} · {artist.genre}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
        <Kpi label="Monthly" value={artist.streams} accent={artist.accent} />
        <Kpi
          label="Δ 7j"
          value={`+${artist.delta}%`}
          accent={artist.accent}
          highlight
        />
        <Kpi label="Save rate" value={`${artist.saveRate}%`} accent={artist.accent} />
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Vélocité streaming · 7j
          </p>
          <span className="tabular text-[11px] text-muted-foreground">pic vendredi</span>
        </div>
        <AreaChart color={artist.accent} />

        <div className="flex items-start gap-3 rounded-2xl border border-line bg-[color:var(--surface)] p-4">
          <span
            className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full"
            style={{ background: artist.accent + "1A", color: artist.accent }}
          >
            <Sparkles className="size-3.5" strokeWidth={2.5} />
          </span>
          <p className="text-[13px] leading-snug text-foreground/85">
            <span className="font-semibold">AI insight :</span> {artist.insight}
          </p>
        </div>

        <Link
          to="/artists/$slug"
          params={{ slug: artist.slug }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-[12px] font-semibold text-background transition-opacity hover:opacity-90"
        >
          Ouvrir la fiche artiste <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className="mt-1.5 tabular text-lg font-bold"
        style={highlight ? { color: accent } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function AreaChart({ color }: { color: string }) {
  const points = [10, 22, 18, 30, 28, 42, 38, 55, 48, 70, 62, 90];
  const w = 320;
  const h = 90;
  const step = w / (points.length - 1);
  const max = Math.max(...points);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 4)}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad)" />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * (h - 4)}
        r="3.5"
        fill={color}
      />
    </svg>
  );
}

/* -------------------- INSIGHTS ROW -------------------- */

function InsightsRow() {
  return (
    <section className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
      <InsightCard
        kicker="Alerte virale"
        accent="#ED2362"
        title="Hina ‘Fantaisie’ entre dans le Top 50 Viral France"
        body="+240k UGC TikTok en 14j. Recommandation : booster paid social IDF + Lyon."
      />
      <InsightCard
        kicker="Signal géographique"
        accent="#1E5BFF"
        title="Zazie accélère à Bruxelles (+82%)"
        body="Effet single « Peu Importe ». Le modèle tour suggère une date Forest National."
      />
      <InsightCard
        kicker="Streaming"
        accent="#5A8DB8"
        title="Jérémy Frerot — entrée playlist >100k followers"
        body="Alerte seuil dépassé. Save rate en hausse sur ‘Un homme’, opportunité radio Q2."
      />
    </section>
  );
}

function InsightCard({
  kicker,
  accent,
  title,
  body,
}: {
  kicker: string;
  accent: string;
  title: string;
  body: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-line bg-card p-7 transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]">
      <span
        className="absolute left-0 top-0 h-1 w-16 origin-left transition-transform duration-500 group-hover:scale-x-[6]"
        style={{ background: accent }}
      />
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: accent }}
      >
        {kicker}
      </p>
      <h4 className="display-tight mt-3 text-2xl leading-tight text-balance">{title}</h4>
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
      <Link
        to="/insights"
        className="mt-5 inline-flex items-center gap-1 text-[12px] font-semibold text-foreground"
      >
        Voir l'analyse <ArrowUpRight className="size-3.5" />
      </Link>
    </article>
  );
}
