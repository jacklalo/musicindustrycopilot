import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Users, Play, ArrowUpRight } from "lucide-react";
import { TopNav, Footer } from "@/components/TopNav";
import { getArtist, ROSTER, type Artist } from "@/lib/roster";

export const Route = createFileRoute("/artists/$slug")({
  loader: ({ params }) => {
    const artist = getArtist(params.slug);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.artist.name ?? "Artiste"} — #NP Intelligence` },
      { name: "description", content: loaderData?.artist.bio ?? "Fiche artiste #NP." },
      { property: "og:title", content: `${loaderData?.artist.name ?? "Artiste"} — #NP` },
      { property: "og:description", content: loaderData?.artist.bio ?? "" },
      { property: "og:image", content: loaderData?.artist.cover ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="micro">404</p>
        <h1 className="display-serif mt-3 text-5xl">Artiste introuvable</h1>
        <Link
          to="/roster"
          className="mt-6 inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-sm"
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
  const others = ROSTER.filter((a) => a.slug !== artist.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      {/* EDITORIAL HERO — paper, no gradient */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1320px] px-6 pt-10 lg:px-12">
          <Link
            to="/roster"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Roster
          </Link>
        </div>
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-end gap-10 px-6 pb-16 pt-10 md:grid-cols-12 lg:px-12 lg:pb-24 lg:pt-14">
          <div className="md:col-span-7 flex flex-col gap-7">
            <p className="micro">
              N°{String(artist.rank).padStart(2, "0")} · {artist.genre} · {artist.city}
            </p>
            <h1 className="text-[clamp(56px,9vw,128px)] leading-[0.88] tracking-[-0.04em] text-balance">
              <span className="display-serif italic text-muted-foreground">A portrait of </span>
              <span className="display-tight">{artist.name}</span>
            </h1>
            <p className="max-w-[55ch] text-[15px] leading-relaxed text-muted-foreground text-pretty">
              {artist.bio}
            </p>
            <div className="flex flex-wrap items-center gap-5 pt-2 text-[12px]">
              <button className="group inline-flex items-center gap-2.5 border-b border-foreground pb-1 font-medium">
                <Play className="size-3.5 fill-foreground" strokeWidth={0} />
                Lire <span className="italic display-serif text-base">{artist.track}</span>
              </button>
              <span className="text-muted-foreground">
                Album · {artist.album}
              </span>
            </div>
          </div>

          <div className="md:col-span-5 md:justify-self-end w-full max-w-[420px]">
            <div className="grain-card relative aspect-square overflow-hidden border border-line">
              <img
                src={artist.cover}
                alt={artist.name}
                className="size-full object-cover"
              />
            </div>
            <p className="micro mt-3 text-right">{artist.album}</p>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-6 md:grid-cols-4 lg:px-12">
          <Stat label="Auditeurs mensuels" value={artist.streams} />
          <Stat label="Δ 7 jours" value={`${artist.delta >= 0 ? "+" : ""}${artist.delta}%`} divider />
          <Stat label="Save rate" value={`${artist.saveRate}%`} divider />
          <Stat label="Audience sociale" value={artist.socialReach} divider />
        </div>
      </section>

      <main className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 px-6 py-20 lg:grid-cols-12 lg:px-12">
        {/* Momentum */}
        <section className="lg:col-span-8">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <p className="micro">Momentum streaming · 8 semaines</p>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {artist.status}
            </span>
          </div>
          <BigChart values={artist.momentum} />

          <div className="mt-12 border-t border-line pt-8">
            <p className="micro">Note de la rédaction</p>
            <p className="display-serif mt-4 max-w-[55ch] text-[28px] leading-[1.2] text-balance">
              “{artist.insight}”
            </p>
          </div>
        </section>

        {/* Side meta */}
        <aside className="space-y-12 lg:col-span-4">
          <div>
            <p className="micro">Live</p>
            <ul className="mt-5 space-y-4 text-[13px]">
              <Meta icon={<Calendar className="size-3.5" strokeWidth={1.75} />} label={`${artist.tourDates} dates en tournée`} />
              <Meta icon={<MapPin className="size-3.5" strokeWidth={1.75} />} label={`Base · ${artist.city}, ${artist.country}`} />
              <Meta icon={<Users className="size-3.5" strokeWidth={1.75} />} label={`${artist.socialReach} sur les réseaux`} />
            </ul>
            <Link
              to="/tours"
              className="mt-6 inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-[12px] font-medium"
            >
              Voir l'agenda live <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="border-t border-line pt-8">
            <p className="micro">Aussi managés par #NP</p>
            <ul className="mt-5 divide-y divide-line">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    to="/artists/$slug"
                    params={{ slug: o.slug }}
                    className="group flex items-center gap-4 py-3"
                  >
                    <img
                      src={o.cover}
                      alt=""
                      loading="lazy"
                      className="size-10 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium leading-tight group-hover:underline">
                        {o.name}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {o.genre}
                      </p>
                    </div>
                    <span className="tabular text-[11px] text-muted-foreground">
                      N°{String(o.rank).padStart(2, "0")}
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
  divider,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <div className={`py-8 ${divider ? "border-l border-line pl-6 lg:pl-10" : ""}`}>
      <p className="micro">{label}</p>
      <p className="display-serif tabular mt-2 text-[32px] leading-none">{value}</p>
    </div>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-3 text-foreground/85">
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </li>
  );
}

function BigChart({ values }: { values: Artist["momentum"] }) {
  const w = 640;
  const h = 220;
  const pad = 8;
  const step = w / (values.length - 1);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const y = (p: number) => h - ((p - min) / range) * (h - pad * 2) - pad;
  const path = values.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${y(p)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-10 h-56 w-full">
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1="0"
          x2={w}
          y1={h * p}
          y2={h * p}
          stroke="var(--line)"
        />
      ))}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground"
      />
      {values.map((p, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={y(p)}
          r={i === values.length - 1 ? 4 : 1.75}
          fill="currentColor"
          className="text-foreground"
        />
      ))}
    </svg>
  );
}
