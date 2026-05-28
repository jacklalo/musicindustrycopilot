import { createFileRoute } from "@tanstack/react-router";
import { Play, Search, MoreHorizontal, TrendingUp, TrendingDown, Sparkles, ArrowUpRight, Bell } from "lucide-react";
import cover1 from "@/assets/cover-1.jpg";
import cover2 from "@/assets/cover-2.jpg";
import cover3 from "@/assets/cover-3.jpg";
import cover4 from "@/assets/cover-4.jpg";
import cover5 from "@/assets/cover-5.jpg";
import cover6 from "@/assets/cover-6.jpg";
import cover7 from "@/assets/cover-7.jpg";
import cover8 from "@/assets/cover-8.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "#NP Intelligence — Artist Performance Dashboard" },
      {
        name: "description",
        content:
          "The artist intelligence platform for Hashtag NP. Streaming, social, tour and audience analytics for the entire roster, in one place.",
      },
      { property: "og:title", content: "#NP Intelligence — Artist Performance Dashboard" },
      {
        property: "og:description",
        content: "Streaming, social, tour and audience analytics for the entire #NP roster.",
      },
    ],
  }),
  component: Dashboard,
});

type Artist = {
  rank: number;
  prev: number;
  name: string;
  track: string;
  genre: string;
  cover: string;
  accent: string; // tailwind-ish hex
  streams: string;
  delta: number; // %
  momentum: number[]; // 0-100
  status: "viral" | "rising" | "stable" | "drop";
  country: string;
};

const ARTISTS: Artist[] = [
  { rank: 1, prev: 3, name: "Elena Vane", track: "Lucid Dreams", genre: "Synth-pop", cover: cover1, accent: "#ED2362", streams: "24.4M", delta: 42.8, momentum: [10, 18, 22, 30, 38, 55, 78, 96], status: "viral", country: "FR" },
  { rank: 2, prev: 2, name: "Otto System", track: "Neon Pulse", genre: "Electronic", cover: cover2, accent: "#1E5BFF", streams: "18.1M", delta: 12.4, momentum: [40, 45, 50, 55, 58, 62, 68, 74], status: "rising", country: "DE" },
  { rank: 3, prev: 1, name: "Maya Sol", track: "Linen Skies", genre: "Indie Folk", cover: cover3, accent: "#E07B2D", streams: "14.2M", delta: -3.2, momentum: [85, 80, 78, 74, 70, 66, 62, 60], status: "drop", country: "UK" },
  { rank: 4, prev: 7, name: "K-OS", track: "Acid Garden", genre: "Techno", cover: cover4, accent: "#2DE07A", streams: "9.8M", delta: 28.6, momentum: [20, 24, 30, 40, 52, 60, 72, 84], status: "rising", country: "BE" },
  { rank: 5, prev: 5, name: "Julian Vane", track: "Hollow Crown", genre: "Hip-Hop", cover: cover5, accent: "#2B2B2B", streams: "8.9M", delta: 4.1, momentum: [60, 62, 58, 64, 66, 65, 68, 70], status: "stable", country: "US" },
  { rank: 6, prev: 4, name: "Luna Vane", track: "Soft Static", genre: "Pop", cover: cover6, accent: "#E2A8DA", streams: "7.4M", delta: -1.8, momentum: [70, 68, 65, 64, 62, 60, 60, 58], status: "stable", country: "FR" },
  { rank: 7, prev: 9, name: "Sade Vega", track: "Velvet Smoke", genre: "R&B", cover: cover7, accent: "#7A2DE0", streams: "6.1M", delta: 18.0, momentum: [25, 30, 36, 44, 52, 60, 66, 72], status: "rising", country: "US" },
  { rank: 8, prev: 6, name: "The Nightingales", track: "Mesa Red", genre: "Indie Rock", cover: cover8, accent: "#2DA89A", streams: "5.3M", delta: 6.4, momentum: [50, 52, 54, 55, 58, 60, 60, 62], status: "stable", country: "ES" },
];

function Dashboard() {
  const featured = ARTISTS[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <Hero featured={featured} />
      <main className="mx-auto max-w-[1440px] px-6 pb-32 lg:px-12">
        <Toolbar />
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <Leaderboard artists={ARTISTS} />
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

/* -------------------- NAV -------------------- */

function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-baseline gap-1.5">
            <span className="display-tight text-xl">#NP</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Intelligence</span>
          </a>
          <nav className="hidden items-center gap-7 text-[13px] font-medium md:flex">
            <a className="text-foreground" href="#">Charts</a>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href="#">Roster</a>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href="#">Tours</a>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href="#">Insights</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Search" className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Search className="size-4" strokeWidth={2.25} />
          </button>
          <button className="hidden h-9 items-center gap-2 rounded-full bg-foreground px-4 text-[12px] font-semibold text-background transition-opacity hover:opacity-90 sm:inline-flex">
            <Bell className="size-3.5" strokeWidth={2.5} />
            3 Alerts
          </button>
          <div className="grid size-9 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background">PN</div>
        </div>
      </div>
    </header>
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
            Live Roster — Week 48
          </div>
          <h1 className="display-tight text-[clamp(48px,8vw,112px)] leading-[0.92] text-balance">
            Top <span className="italic text-white/60">200</span>
            <br />
            Hashtag&nbsp;NP.
          </h1>
          <p className="max-w-[52ch] text-base text-white/65 text-pretty">
            The artists moving the needle this week — streaming velocity, social pulse, and tour heat across the entire managed catalogue.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="group inline-flex h-12 items-center gap-3 rounded-full bg-white pl-2 pr-5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]">
              <span className="grid size-9 place-items-center rounded-full bg-[var(--ink)] text-white transition-colors group-hover:bg-[color:var(--pop)]">
                <Play className="size-4 fill-current" strokeWidth={0} />
              </span>
              Play roster radio
            </button>
            <a href="#chart" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5">
              Browse chart <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        {/* Floating album collage */}
        <div className="md:col-span-5 relative h-[280px] sm:h-[360px] md:h-auto">
          <CollageCard src={featured.cover} accent={featured.accent} className="absolute right-[8%] top-[8%] size-[58%] rotate-[8deg]" featured />
          <CollageCard src={ARTISTS[1].cover} accent={ARTISTS[1].accent} className="absolute right-[40%] top-[28%] size-[42%] rotate-[-12deg]" />
          <CollageCard src={ARTISTS[3].cover} accent={ARTISTS[3].accent} className="absolute right-[2%] bottom-[6%] size-[38%] rotate-[18deg]" />
        </div>
      </div>
    </section>
  );
}

function CollageCard({ src, accent, className, featured }: { src: string; accent: string; className?: string; featured?: boolean }) {
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
            #1 This week
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- TOOLBAR -------------------- */

function Toolbar() {
  const tabs = ["Top 200", "Viral", "Rising", "Tours", "Catalog"];
  return (
    <div id="chart" className="flex flex-col gap-4 pt-10 sm:flex-row sm:items-center sm:justify-between">
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
        <span>Sync 4m ago</span>
        <span className="size-1 rounded-full bg-line" />
        <button className="font-semibold text-foreground underline-offset-4 hover:underline">Download CSV</button>
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
        <div className="col-span-5">Artist / Track</div>
        <div className="col-span-2 hidden md:block">Momentum</div>
        <div className="col-span-2 text-right">Streams</div>
        <div className="col-span-2 text-right">Δ 7d</div>
      </div>
      <ul>
        {artists.map((a) => (
          <ArtistRow key={a.rank} a={a} />
        ))}
      </ul>
    </div>
  );
}

function ArtistRow({ a }: { a: Artist }) {
  const rankDelta = a.prev - a.rank;
  return (
    <li
      className="group relative grid grid-cols-12 items-center gap-4 border-b border-line py-4 transition-colors hover:bg-[color:var(--surface)]"
      style={{ ["--row-accent" as string]: a.accent }}
    >
      {/* left color bleed */}
      <span
        className="absolute left-0 top-0 h-full w-[3px] origin-left scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{ background: a.accent }}
      />
      <div className="col-span-1 flex items-center gap-2">
        <span className="tabular text-base font-semibold">{String(a.rank).padStart(2, "0")}</span>
        <RankArrow delta={rankDelta} />
      </div>

      <div className="col-span-5 flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={a.cover}
            alt=""
            loading="lazy"
            width={56}
            height={56}
            className="size-14 rounded-lg object-cover ring-1 ring-black/5 transition-transform group-hover:scale-[1.04]"
          />
          <button
            aria-label={`Play ${a.track}`}
            className="absolute inset-0 m-auto grid size-8 place-items-center rounded-full bg-white/95 opacity-0 shadow-lg ring-1 ring-black/10 transition-opacity group-hover:opacity-100"
          >
            <Play className="size-3.5 fill-black" strokeWidth={0} />
          </button>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight">{a.track}</p>
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
        <Sparkline values={a.momentum} color={a.accent} />
      </div>

      <div className="col-span-2 text-right">
        <p className="tabular text-[14px] font-semibold">{a.streams}</p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">listeners</p>
      </div>

      <div className="col-span-2 flex items-center justify-end gap-2">
        <DeltaBadge delta={a.delta} status={a.status} accent={a.accent} />
        <button aria-label="Actions" className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
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

function DeltaBadge({ delta, status, accent }: { delta: number; status: Artist["status"]; accent: string }) {
  const label =
    status === "viral" ? "Viral" : status === "rising" ? "Rising" : status === "drop" ? "Cooling" : "Stable";
  const positive = delta >= 0;
  return (
    <div
      className="hidden items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline-flex"
      style={{
        borderColor: status === "viral" || status === "rising" ? accent + "55" : "var(--line)",
        background: status === "viral" || status === "rising" ? accent + "12" : "transparent",
        color: status === "drop" ? "rgb(225 29 72)" : status === "viral" || status === "rising" ? accent : "var(--muted-foreground)",
      }}
    >
      <span className="tabular">{positive ? "+" : ""}{delta.toFixed(1)}%</span>
      <span className="hidden md:inline">{label}</span>
    </div>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-9 items-end gap-1">
      {values.map((v, i) => (
        <span
          key={i}
          className="w-1 rounded-sm"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            opacity: 0.25 + (i / values.length) * 0.75,
          }}
        />
      ))}
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
          <p className="mt-1 text-sm text-white/75">{artist.name} · {artist.genre}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
        <Kpi label="Monthly" value={artist.streams} accent={artist.accent} />
        <Kpi label="Δ 7d" value={`+${artist.delta}%`} accent={artist.accent} highlight />
        <Kpi label="Save rate" value="68%" accent={artist.accent} />
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Streaming velocity · 7d</p>
          <span className="tabular text-[11px] text-muted-foreground">peak Fri</span>
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
            <span className="font-semibold">AI insight:</span> {artist.name} is accelerating in Berlin & São Paulo — TikTok engagement up
            <span className="font-semibold" style={{ color: artist.accent }}> +42%</span> this week. Recommend localized ad-spend for the Q4 single.
          </p>
        </div>

        <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-[12px] font-semibold text-background transition-opacity hover:opacity-90">
          Open artist file <ArrowUpRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Kpi({ label, value, accent, highlight }: { label: string; value: string; accent: string; highlight?: boolean }) {
  return (
    <div className="p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
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
  // Static path — purely decorative, scales to viewBox
  const points = [10, 22, 18, 30, 28, 42, 38, 55, 48, 70, 62, 90];
  const w = 320;
  const h = 90;
  const step = w / (points.length - 1);
  const max = Math.max(...points);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 4)}`).join(" ");
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
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - (points[points.length - 1] / max) * (h - 4)} r="3.5" fill={color} />
    </svg>
  );
}

/* -------------------- INSIGHTS ROW -------------------- */

function InsightsRow() {
  return (
    <section className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
      <InsightCard
        kicker="Viral alert"
        accent="#ED2362"
        title="‘Acid Garden’ enters Top 50 Viral — Indonesia"
        body="K-OS detected on 24k UGC TikToks in 48h. Recommend boosting paid social in JKT."
      />
      <InsightCard
        kicker="Geographic shift"
        accent="#1E5BFF"
        title="Elena Vane accelerating in Berlin (+412%)"
        body="Live snippet leak driving traffic. Tour demand model suggests adding a second Berghain date."
      />
      <InsightCard
        kicker="Catalog signal"
        accent="#E07B2D"
        title="Maya Sol vinyl demand exceeds run by 4×"
        body="High save-rate on ‘Linen Skies’. Open repress + bundle with merch drop."
      />
    </section>
  );
}

function InsightCard({ kicker, accent, title, body }: { kicker: string; accent: string; title: string; body: string }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-line bg-card p-7 transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]">
      <span
        className="absolute left-0 top-0 h-1 w-16 origin-left transition-transform duration-500 group-hover:scale-x-[6]"
        style={{ background: accent }}
      />
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
        {kicker}
      </p>
      <h4 className="display-tight mt-3 text-2xl leading-tight text-balance">{title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">{body}</p>
      <a href="#" className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
        View details <ArrowUpRight className="size-3.5" />
      </a>
    </article>
  );
}

/* -------------------- FOOTER -------------------- */

function Footer() {
  return (
    <footer className="border-t border-line bg-[var(--ink)] py-14 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between lg:px-12">
        <div>
          <p className="display-tight text-4xl leading-none">#NP Intelligence.</p>
          <p className="mt-3 max-w-md text-sm text-white/55">
            Built for the management cockpit of Hashtag NP — by Pascal Nègre's team. Data at the speed of culture.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-white/55">
          <span>v2.4 · Live</span>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Status</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
