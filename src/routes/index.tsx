import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Play,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { TopNav, Footer } from "@/components/TopNav";
import { ROSTER, type Artist } from "@/lib/roster";

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <Hero featured={featured} />
      <main className="mx-auto max-w-[1440px] px-6 pb-32 lg:px-12">
        <Toolbar />
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <Leaderboard artists={ROSTER} />
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

/* -------------------- HERO -------------------- */

function Hero({ featured }: { featured: Artist }) {
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
            <button className="group inline-flex h-12 items-center gap-3 rounded-full bg-white pl-2 pr-5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]">
              <span className="grid size-9 place-items-center rounded-full bg-[var(--ink)] text-white transition-colors group-hover:bg-[color:var(--pop)]">
                <Play className="size-4 fill-current" strokeWidth={0} />
              </span>
              Lancer la radio roster
            </button>
            <a
              href="#chart"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
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

function Toolbar() {
  const tabs = ["Top Roster", "Viral", "Rising", "Catalogue"];
  return (
    <div
      id="chart"
      className="flex flex-col gap-4 pt-10 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            className={
              i === 0
                ? "h-9 rounded-full bg-foreground px-4 text-[12px] font-semibold text-background"
                : "h-9 rounded-full border border-line px-4 text-[12px] font-semibold text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            }
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Sync il y a 4 min</span>
        <span className="size-1 rounded-full bg-line" />
        <button className="font-semibold text-foreground underline-offset-4 hover:underline">
          Export CSV
        </button>
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
      <ul>
        {artists.map((a) => (
          <ArtistRow key={a.slug} a={a} />
        ))}
      </ul>
    </div>
  );
}

function ArtistRow({ a }: { a: Artist }) {
  const rankDelta = a.prev - a.rank;
  return (
    <li
      className="group relative grid grid-cols-12 items-center gap-4 border-b border-line px-3 py-4 transition-colors hover:rounded-2xl hover:border-transparent hover:bg-[color:var(--surface)] hover:shadow-[0_8px_24px_-16px_rgba(0,0,0,0.18)]"
      style={{ ["--row-accent" as string]: a.accent }}
    >
      <div className="col-span-1 flex items-center gap-2">
        <span className="tabular text-base font-semibold">
          {String(a.rank).padStart(2, "0")}
        </span>
        <RankArrow delta={rankDelta} />
      </div>

      <div className="col-span-5 flex items-center gap-4">
        <Link
          to="/artists/$slug"
          params={{ slug: a.slug }}
          className="relative shrink-0"
        >
          <img
            src={a.cover}
            alt=""
            loading="lazy"
            width={56}
            height={56}
            className="size-14 rounded-lg object-cover ring-1 ring-black/5 transition-transform group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 m-auto grid size-8 place-items-center rounded-full bg-white/95 opacity-0 shadow-lg ring-1 ring-black/10 transition-opacity group-hover:opacity-100">
            <Play className="size-3.5 fill-black" strokeWidth={0} />
          </span>
        </Link>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight">{a.track}</p>
          <p className="truncate text-[12px] text-muted-foreground">
            <Link
              to="/artists/$slug"
              params={{ slug: a.slug }}
              className="font-medium text-foreground/80 hover:text-foreground"
            >
              {a.name}
            </Link>
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
        <button
          aria-label="Actions"
          className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </li>
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

function DeltaBadge({
  delta,
  status,
  accent,
}: {
  delta: number;
  status: Artist["status"];
  accent: string;
}) {
  const label =
    status === "viral"
      ? "Viral"
      : status === "rising"
        ? "Rising"
        : status === "drop"
          ? "Cooling"
          : "Stable";
  const positive = delta >= 0;
  return (
    <div
      className="hidden items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline-flex"
      style={{
        borderColor:
          status === "viral" || status === "rising" ? accent + "55" : "var(--line)",
        background:
          status === "viral" || status === "rising" ? accent + "12" : "transparent",
        color:
          status === "drop"
            ? "rgb(225 29 72)"
            : status === "viral" || status === "rising"
              ? accent
              : "var(--muted-foreground)",
      }}
    >
      <span className="tabular">
        {positive ? "+" : ""}
        {delta.toFixed(1)}%
      </span>
      <span className="hidden md:inline">{label}</span>
    </div>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  // 5 niveaux: -2 forte baisse, -1 baisse, 0 stable, +1 hausse, +2 forte hausse
  const first = values[0];
  const last = values[values.length - 1];
  const pct = ((last - first) / Math.max(first, 1)) * 100;
  let level: -2 | -1 | 0 | 1 | 2 = 0;
  if (pct >= 40) level = 2;
  else if (pct >= 10) level = 1;
  else if (pct <= -25) level = -2;
  else if (pct <= -5) level = -1;

  const angle = { [-2]: 90, [-1]: 45, 0: 0, 1: -45, 2: -90 }[level];
  const tone =
    level >= 2
      ? "text-emerald-600"
      : level === 1
        ? "text-emerald-500"
        : level === 0
          ? "text-muted-foreground"
          : level === -1
            ? "text-rose-500"
            : "text-rose-600";
  const label =
    level === 2
      ? "Forte croissance"
      : level === 1
        ? "Croissance"
        : level === 0
          ? "Stable"
          : level === -1
            ? "Baisse"
            : "Forte baisse";

  return (
    <div className="flex h-9 items-center" aria-label={label} title={label}>
      <svg
        viewBox="0 0 24 24"
        className={`size-6 ${tone}`}
        style={{ transform: `rotate(${angle}deg)`, color: level === 0 ? undefined : color }}
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
  return (
    <div className="sticky top-24 overflow-hidden rounded-3xl border border-line bg-card">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img src={artist.cover} alt="" className="size-full object-cover" />
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
        title="Suzane entre dans le Top 50 Viral France"
        body="‘Toï Toï’ détecté sur +18k UGC en 48h. Recommandation : booster paid social IDF + Lyon."
      />
      <InsightCard
        kicker="Signal géographique"
        accent="#1E5BFF"
        title="Mylène Farmer accélère à Montréal (+212%)"
        body="Effet teaser Nevermore II. Le modèle de demande tour suggère une 2ᵉ date Bell Centre."
      />
      <InsightCard
        kicker="Catalogue"
        accent="#E07B2D"
        title="Julien Clerc : vinyle ‘Si on chantait’ rupture 4×"
        body="Save rate élevé sur les classiques. Repress + bundle merch à ouvrir avant la tournée."
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
