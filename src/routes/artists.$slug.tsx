import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Sparkles, MapPin, Calendar, Users, Play, Heart, Share2, Radio, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { TopNav, Footer } from "@/components/TopNav";
import { usePlayer } from "@/components/player/PlayerProvider";
import { getArtist, ROSTER, type Artist } from "@/lib/roster";
import { getDeezerLive } from "@/lib/deezer.functions";

export const Route = createFileRoute("/artists/$slug")({
  loader: ({ params }) => {
    const artist = getArtist(params.slug);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.artist.name ?? "Artiste"} — #NP Intelligence` },
      {
        name: "description",
        content: loaderData?.artist.bio ?? "Fiche artiste #NP.",
      },
      {
        property: "og:title",
        content: `${loaderData?.artist.name ?? "Artiste"} — #NP`,
      },
      { property: "og:description", content: loaderData?.artist.bio ?? "" },
      { property: "og:image", content: loaderData?.artist.cover ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          404
        </p>
        <h1 className="display-tight mt-3 text-4xl">Artiste introuvable</h1>
        <Link
          to="/roster"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
        >
          <ArrowLeft className="size-4" /> Retour au roster
        </Link>
      </div>
    </div>
  ),
  component: ArtistPage,
});

function ArtistPage() {
  const { artist } = Route.useLoaderData();
  const { play, toggleLike, state } = usePlayer();
  const liked = !!state.liked[artist.slug];
  const others = ROSTER.filter((a) => a.slug !== artist.slug).slice(0, 4);

  const fetchDeezer = useServerFn(getDeezerLive);
  const live = useQuery({
    queryKey: ["deezer", artist.slug],
    queryFn: () => fetchDeezer({ data: { q: artist.deezerQuery ?? artist.name } }),
    staleTime: 5 * 60_000,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-line text-white"
        style={{
          background: `linear-gradient(135deg, ${artist.accent} 0%, #0B0B0B 75%)`,
        }}
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 py-14 md:grid-cols-12 lg:px-12 lg:py-20">
          <div className="md:col-span-7 flex flex-col gap-6">
            <Link
              to="/roster"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 hover:text-white"
            >
              <ArrowLeft className="size-3.5" /> Roster
            </Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">
              {artist.genre} · {artist.city}, {artist.country}
            </p>
            <h1 className="display-tight text-[clamp(48px,8vw,104px)] leading-[0.9] text-balance">
              {artist.name}
            </h1>
            <p className="max-w-[55ch] text-white/80">{artist.bio}</p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => play(artist)}
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-white pl-2 pr-5 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.5)]"
              >
                <span className="grid size-9 place-items-center rounded-full bg-black text-white transition-colors group-hover:bg-[color:var(--pop)]">
                  <Play className="size-4 fill-current" strokeWidth={0} />
                </span>
                Lire {artist.track}
              </button>
              <button
                onClick={() => toggleLike(artist.slug)}
                aria-pressed={liked}
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white/80 transition-all hover:scale-105 hover:border-white/40 hover:text-white"
                aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart
                  className="size-4"
                  fill={liked ? artist.accent : "none"}
                  color={liked ? artist.accent : "currentColor"}
                />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard
                    ?.writeText(`${window.location.origin}/artists/${artist.slug}`)
                    .catch(() => {});
                  toast("Lien fiche artiste copié");
                }}
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white/80 transition-all hover:scale-105 hover:border-white/40 hover:text-white"
                aria-label="Partager"
              >
                <Share2 className="size-4" />
              </button>
              <span className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-white/80">
                Rang #{String(artist.rank).padStart(2, "0")} · cette semaine
              </span>
            </div>
          </div>

          <div className="md:col-span-5 self-start">
            <div className="relative">
              <img
                src={artist.cover}
                alt={artist.name}
                className="w-full rounded-3xl object-cover shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
              />
              <span className="absolute -bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: artist.accent }}
                />
                {artist.album}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-line border-x border-line md:grid-cols-4">
          <Stat label="Streams mensuels" value={artist.streams} />
          <Stat
            label="Δ 7j"
            value={`${artist.delta >= 0 ? "+" : ""}${artist.delta}%`}
            accent={artist.accent}
          />
          <Stat label="Save rate" value={`${artist.saveRate}%`} />
          <Stat label="Audience sociale" value={artist.socialReach} />
        </div>
      </section>

      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-12 lg:px-12">
        {/* Momentum chart */}
        <section className="lg:col-span-8">
          <div className="rounded-3xl border border-line bg-card p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Momentum streaming · 8 semaines
                </p>
                <h3 className="display-tight mt-1 text-2xl">{artist.track}</h3>
              </div>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: artist.accent + "18",
                  color: artist.accent,
                }}
              >
                {artist.status}
              </span>
            </div>
            <BigChart values={artist.momentum} color={artist.accent} />
          </div>

          {/* Insight */}
          <div
            className="mt-6 flex items-start gap-4 rounded-3xl border border-line p-6"
            style={{ background: artist.accent + "0A" }}
          >
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full"
              style={{ background: artist.accent + "22", color: artist.accent }}
            >
              <Sparkles className="size-4" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                AI insight
              </p>
              <p className="mt-1 text-[15px] leading-snug text-foreground/85">
                {artist.insight}
              </p>
            </div>
          </div>
        </section>

        {/* Side meta */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-line bg-card p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Live
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <Meta icon={<Calendar className="size-3.5" />} label={`${artist.tourDates} dates en tournée`} />
              <Meta icon={<MapPin className="size-3.5" />} label={`Base : ${artist.city}, ${artist.country}`} />
              <Meta icon={<Users className="size-3.5" />} label={`${artist.socialReach} d'audience sociale`} />
            </ul>
            <Link
              to="/tours"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-foreground py-2.5 text-[12px] font-semibold text-background hover:opacity-90"
            >
              Voir l'agenda live
            </Link>
          </div>

          <div className="rounded-3xl border border-line bg-card p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Aussi managés par #NP
            </p>
            <ul className="mt-4 space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    to="/artists/$slug"
                    params={{ slug: o.slug }}
                    className="group flex items-center gap-3"
                  >
                    <img
                      src={o.cover}
                      alt=""
                      loading="lazy"
                      className="size-10 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold leading-tight group-hover:underline">
                        {o.name}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {o.genre}
                      </p>
                    </div>
                    <span
                      className="tabular text-[11px] font-semibold"
                      style={{ color: o.accent }}
                    >
                      #{String(o.rank).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="px-6 py-7 lg:px-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p
        className="mt-2 tabular text-2xl font-bold"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-foreground/80">
      <span className="grid size-6 place-items-center rounded-full bg-secondary text-muted-foreground">
        {icon}
      </span>
      {label}
    </li>
  );
}

function BigChart({ values, color }: { values: Artist["momentum"]; color: string }) {
  const w = 640;
  const h = 200;
  const step = w / (values.length - 1);
  const max = Math.max(...values);
  const path = values
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 12) - 6}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-6 h-48 w-full">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1="0"
          x2={w}
          y1={h * p}
          y2={h * p}
          stroke="var(--line)"
          strokeDasharray="2 4"
        />
      ))}
      <path d={area} fill={`url(#g-${color})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((p, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={h - (p / max) * (h - 12) - 6}
          r={i === values.length - 1 ? 5 : 2.5}
          fill={color}
        />
      ))}
    </svg>
  );
}
