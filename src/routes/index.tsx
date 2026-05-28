import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, ArrowUpRight, ArrowUp, ArrowDown } from "lucide-react";
import { TopNav, Footer } from "@/components/TopNav";
import { ROSTER, type Artist } from "@/lib/roster";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "#NP Intelligence — Charts" },
      {
        name: "description",
        content:
          "Charts hebdomadaires du roster Hashtag NP : streaming, social, live. L'intelligence artiste, restituée avec retenue.",
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
    <div className="relative min-h-screen bg-background text-foreground">
      <TopNav />
      <Masthead featured={featured} />
      <main className="mx-auto max-w-[1320px] px-6 lg:px-12">
        <Toolbar />
        <div className="mt-10 grid grid-cols-1 gap-16 lg:grid-cols-12">
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

/* -------------------- MASTHEAD -------------------- */

function Masthead({ featured }: { featured: Artist }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1320px] px-6 pb-14 pt-20 lg:px-12 lg:pb-20 lg:pt-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-8 flex flex-col gap-7">
            <p className="micro">
              Semaine 48 · 14 artistes · sync il y a 4 min
            </p>
            <h1 className="text-[clamp(56px,9vw,140px)] leading-[0.88] tracking-[-0.04em] text-balance">
              <span className="display-serif italic text-muted-foreground">The </span>
              <span className="display-tight">Roster.</span>
            </h1>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground text-pretty">
              Quatorze artistes managés par Hashtag NP. Une lecture hebdomadaire
              de leur vélocité — streaming, social, live — sans bruit superflu.
            </p>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Link
              to="/artists/$slug"
              params={{ slug: featured.slug }}
              className="group block w-full max-w-[280px]"
            >
              <div className="grain-card relative aspect-square overflow-hidden border border-line">
                <img
                  src={featured.cover}
                  alt={featured.name}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <p className="micro">N°01 · cette semaine</p>
                <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <p className="display-serif mt-1 text-[22px] leading-tight">
                {featured.name}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- TOOLBAR -------------------- */

function Toolbar() {
  const tabs = ["Roster", "Viral", "Rising", "Catalogue"];
  return (
    <div
      id="chart"
      className="flex flex-col gap-3 pt-12 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-6 text-[12px]">
        {tabs.map((t, i) => (
          <button
            key={t}
            className={
              i === 0
                ? "border-b border-foreground pb-1.5 font-medium text-foreground"
                : "pb-1.5 text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <button className="transition-colors hover:text-foreground">
          Filtrer
        </button>
        <span className="size-1 rounded-full bg-line" />
        <button className="transition-colors hover:text-foreground">
          Exporter
        </button>
      </div>
    </div>
  );
}

/* -------------------- LEADERBOARD -------------------- */

function Leaderboard({ artists }: { artists: Artist[] }) {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-12 gap-4 border-b border-line pb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <div className="col-span-1">N°</div>
        <div className="col-span-6">Artiste</div>
        <div className="col-span-2 hidden text-right md:block">Momentum</div>
        <div className="col-span-2 text-right tabular">Streams</div>
        <div className="col-span-1 text-right tabular">Δ 7j</div>
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
    <li className="group grid grid-cols-12 items-center gap-4 border-b border-line py-5 transition-colors hover:bg-[color:var(--surface)]">
      <div className="col-span-1 flex items-baseline gap-2">
        <span className="tabular display-serif text-[22px] leading-none">
          {String(a.rank).padStart(2, "0")}
        </span>
        <RankArrow delta={rankDelta} />
      </div>

      <div className="col-span-6 flex items-center gap-4 min-w-0">
        <Link
          to="/artists/$slug"
          params={{ slug: a.slug }}
          className="relative shrink-0"
        >
          <img
            src={a.cover}
            alt=""
            loading="lazy"
            width={48}
            height={48}
            className="size-12 object-cover transition-transform group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 m-auto grid size-7 place-items-center rounded-full bg-background/95 opacity-0 ring-1 ring-line transition-opacity group-hover:opacity-100">
            <Play className="size-3 fill-foreground" strokeWidth={0} />
          </span>
        </Link>
        <div className="min-w-0">
          <Link
            to="/artists/$slug"
            params={{ slug: a.slug }}
            className="block truncate text-[15px] font-medium leading-tight hover:underline"
          >
            {a.name}
          </Link>
          <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
            <span className="italic display-serif text-foreground/70">{a.track}</span>
            <span className="mx-2 text-line">·</span>
            {a.genre}
          </p>
        </div>
      </div>

      <div className="col-span-2 hidden md:flex justify-end">
        <Sparkline values={a.momentum} status={a.status} />
      </div>

      <div className="col-span-2 text-right">
        <p className="tabular text-[14px] font-medium">{a.streams}</p>
      </div>

      <div className="col-span-1 text-right">
        <Delta delta={a.delta} />
      </div>
    </li>
  );
}

function RankArrow({ delta }: { delta: number }) {
  if (delta === 0)
    return <span className="text-[10px] text-muted-foreground/60">—</span>;
  if (delta > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] text-foreground/70">
        <ArrowUp className="size-2.5" strokeWidth={2} />
        {delta}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
      <ArrowDown className="size-2.5" strokeWidth={2} />
      {Math.abs(delta)}
    </span>
  );
}

function Delta({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <span
      className={`tabular text-[12px] ${positive ? "text-foreground" : "text-muted-foreground"}`}
    >
      {positive ? "+" : ""}
      {delta.toFixed(1)}
    </span>
  );
}

/* Monochrome sparkline — graphite line, no fill, no bars */
function Sparkline({
  values,
  status,
}: {
  values: number[];
  status: Artist["status"];
}) {
  const w = 96;
  const h = 28;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const path = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  const last = values[values.length - 1];
  const lastY = h - ((last - min) / range) * (h - 4) - 2;
  const isMomentum = status === "viral" || status === "rising";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-24">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isMomentum ? "text-foreground" : "text-muted-foreground/60"}
      />
      <circle cx={w} cy={lastY} r="1.75" fill="currentColor" className={isMomentum ? "text-foreground" : "text-muted-foreground"} />
    </svg>
  );
}

/* -------------------- FEATURED PANEL -------------------- */

function FeaturedPanel({ artist }: { artist: Artist }) {
  return (
    <div className="sticky top-20 space-y-6">
      <div>
        <p className="micro">Focus de la semaine</p>
        <h2 className="display-serif mt-3 text-[44px] leading-[0.95] tracking-tight">
          {artist.name}
        </h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          <span className="italic">{artist.track}</span> · {artist.album}
        </p>
      </div>

      <div className="grain-card aspect-[4/5] w-full overflow-hidden border border-line">
        <img src={artist.cover} alt="" className="size-full object-cover" />
      </div>

      <div className="grid grid-cols-3 border-y border-line">
        <Kpi label="Auditeurs" value={artist.streams} />
        <Kpi label="Δ 7j" value={`+${artist.delta}%`} divider />
        <Kpi label="Save rate" value={`${artist.saveRate}%`} divider />
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <p className="micro">Vélocité · 7 jours</p>
          <span className="tabular text-[10px] text-muted-foreground">
            pic vendredi
          </span>
        </div>
        <MonoChart values={[10, 22, 18, 30, 28, 42, 38, 55, 48, 70, 62, 90]} />
      </div>

      <div className="border-t border-line pt-5">
        <p className="micro">Note</p>
        <p className="display-serif mt-2 text-[18px] leading-snug text-foreground/90">
          “{artist.insight}”
        </p>
      </div>

      <Link
        to="/artists/$slug"
        params={{ slug: artist.slug }}
        className="inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-[12px] font-medium"
      >
        Ouvrir la fiche artiste <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}

function Kpi({
  label,
  value,
  divider,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <div className={`py-4 ${divider ? "border-l border-line pl-4" : ""}`}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="tabular mt-1.5 text-[18px] font-medium">{value}</p>
    </div>
  );
}

function MonoChart({ values }: { values: number[] }) {
  const w = 320;
  const h = 80;
  const step = w / (values.length - 1);
  const max = Math.max(...values);
  const path = values
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 6) - 3}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full">
      <line x1="0" x2={w} y1={h - 0.5} y2={h - 0.5} stroke="var(--line)" />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground"
      />
      <circle
        cx={w}
        cy={h - (values[values.length - 1] / max) * (h - 6) - 3}
        r="2.5"
        fill="currentColor"
        className="text-foreground"
      />
    </svg>
  );
}

/* -------------------- INSIGHTS ROW -------------------- */

function InsightsRow() {
  const picks = [
    { slug: "suzane", kicker: "Signal viral", title: "Suzane entre dans le Top 50 Viral France", body: "‘Toï Toï’ détecté sur +18k UGC en 48h — fenêtre d'amplification courte." },
    { slug: "mylene-farmer", kicker: "Signal géographique", title: "Mylène Farmer accélère à Montréal", body: "+212% d'auditeurs au Québec. La modélisation tour pointe une seconde date." },
    { slug: "julien-clerc", kicker: "Catalogue", title: "Vinyle ‘Si on chantait’ — rupture 4×", body: "Demande catalogue largement supérieure à l'offre. Repress à arbitrer." },
  ];
  return (
    <section className="mt-24 border-t border-line pt-12">
      <div className="flex items-baseline justify-between">
        <p className="micro">Insights de la semaine</p>
        <Link
          to="/insights"
          className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Tout voir →
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-3">
        {picks.map((p) => {
          const a = ROSTER.find((r) => r.slug === p.slug)!;
          return (
            <article key={p.slug} className="group">
              <Link
                to="/artists/$slug"
                params={{ slug: a.slug }}
                className="grain-card block aspect-[4/3] overflow-hidden border border-line"
              >
                <img
                  src={a.cover}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </Link>
              <p className="micro mt-5">{p.kicker}</p>
              <h3 className="display-serif mt-2 text-[22px] leading-[1.15] text-balance">
                {p.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
