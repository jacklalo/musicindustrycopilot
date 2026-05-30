import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, TrendingUp, Globe, Music, ArrowUpRight } from "lucide-react";
import { TopNav, Footer } from "@/components/TopNav";
import { ROSTER } from "@/lib/roster";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — #NP Intelligence" },
      {
        name: "description",
        content:
          "Signaux faibles et forts du roster Hashtag NP — virages géographiques, virales, opportunités catalogue.",
      },
      { property: "og:title", content: "Insights — Hashtag NP" },
      {
        property: "og:description",
        content: "Recommandations data du roster #NP.",
      },
    ],
  }),
  component: InsightsPage,
});

type Insight = {
  kicker: string;
  type: "viral" | "geo" | "catalog" | "live";
  artistSlug: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
};

const INSIGHTS: Insight[] = [
  {
    kicker: "Alerte virale",
    type: "viral",
    artistSlug: "suzane",
    title: "‘Toï Toï’ entre dans le Top 50 Viral France",
    body: "Détecté sur +18k UGC TikTok en 48h. Profil 18-29 dominant, ligne urbaine Paris/Lyon/Marseille. Recommandation : push paid social + activation créateurs.",
    metric: "+41.5%",
    metricLabel: "streams 7j",
  },
  {
    kicker: "Signal géographique",
    type: "geo",
    artistSlug: "mylene-farmer",
    title: "Mylène Farmer accélère à Montréal (+212%)",
    body: "Effet teaser Nevermore II détecté sur Spotify Canada. Le modèle de demande tour suggère une 2ᵉ date au Bell Centre — fenêtre de billetterie à ouvrir.",
    metric: "+212%",
    metricLabel: "auditeurs QC",
  },
  {
    kicker: "Catalogue",
    type: "catalog",
    artistSlug: "julien-clerc",
    title: "Vinyle ‘Si on chantait’ — rupture stock 4×",
    body: "Save rate élevé sur les classiques. Opportunité repress + bundle merch synchronisé avec la tournée des Zéniths.",
    metric: "×4",
    metricLabel: "demande / stock",
  },
  {
    kicker: "Découverte",
    type: "viral",
    artistSlug: "virgile-martini",
    title: "Virgile Martini : profil emerging à pousser",
    body: "Taux d'ajout en playlists user x3 sur 30j. Discover Weekly Spotify délivre 38% des nouveaux auditeurs. Bon moment pour un EP physique.",
    metric: "×3",
    metricLabel: "ajouts playlists",
  },
  {
    kicker: "Live",
    type: "live",
    artistSlug: "klon",
    title: "KLON — Olympia : ouverture billetterie",
    body: "Audience 18-24 dominante, 82% des écoutes en Île-de-France. Le sold-out semble probable dans les 72h après ouverture.",
    metric: "82%",
    metricLabel: "audience IDF",
  },
  {
    kicker: "Sync TV/Ciné",
    type: "catalog",
    artistSlug: "era",
    title: "ERA — 4 placements sync ce trimestre",
    body: "Demande forte sur le catalogue 'The Mass'. Marché US et UK actifs — opportunité de relance dédiée auprès des superviseurs musicaux.",
    metric: "+4",
    metricLabel: "syncs Q4",
  },
];

const TYPE_ICON: Record<Insight["type"], React.ReactNode> = {
  viral: <Sparkles className="size-3.5" strokeWidth={2.5} />,
  geo: <Globe className="size-3.5" strokeWidth={2.5} />,
  catalog: <Music className="size-3.5" strokeWidth={2.5} />,
  live: <TrendingUp className="size-3.5" strokeWidth={2.5} />,
};

function InsightsPage() {
  const featured = INSIGHTS[0];
  const others = INSIGHTS.slice(1);
  const fArtist = ROSTER.find((a) => a.slug === featured.artistSlug)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      <header className="border-b border-line bg-[var(--ink)] text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
            AI signals · mise à jour il y a 4 min
          </p>
          <h1 className="display-tight mt-4 text-[clamp(40px,7vw,88px)] leading-[0.95] text-balance">
            Insights <span className="italic text-white/55">de la semaine</span>.
          </h1>
          <p className="mt-5 max-w-[60ch] text-white/65">
            Les signaux qui méritent une décision — tournée, marketing, catalogue —
            triés par impact sur le roster #NP.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 pb-32 pt-14 lg:px-12">
        {/* Featured */}
        <article
          className="group relative grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-line p-8 md:grid-cols-12 lg:p-12"
          style={{ background: fArtist.accent + "08" }}
        >
          <div className="md:col-span-7">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ background: fArtist.accent + "1A", color: fArtist.accent }}
            >
              {TYPE_ICON[featured.type]}
              {featured.kicker}
            </span>
            <h2 className="display-tight mt-5 text-[clamp(32px,4.5vw,56px)] leading-[0.98] text-balance">
              {featured.title}
            </h2>
            <p className="mt-5 max-w-[55ch] text-base text-foreground/75">
              {featured.body}
            </p>
            <Link
              to="/artists/$slug"
              params={{ slug: fArtist.slug }}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[12px] font-semibold text-background hover:opacity-90"
            >
              Ouvrir la fiche {fArtist.name} <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-black/5">
              <img
                src={fArtist.cover}
                alt={fArtist.name}
                className="size-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {featured.metricLabel}
                </p>
                <p
                  className="tabular mt-1 text-3xl font-bold"
                  style={{ color: fArtist.accent }}
                >
                  {featured.metric}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {others.map((ins, i) => {
            const a = ROSTER.find((r) => r.slug === ins.artistSlug)!;
            return (
              <article
                key={i}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-card p-7 transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]"
              >
                <span
                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ background: a.accent + "15", color: a.accent }}
                >
                  {TYPE_ICON[ins.type]}
                  {ins.kicker}
                </span>
                <h3 className="display-tight mt-4 text-xl leading-tight text-balance">
                  {ins.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {ins.body}
                </p>

                <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                  <Link
                    to="/artists/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-center gap-2 text-[12px] font-semibold hover:underline"
                  >
                    <img
                      src={a.cover}
                      alt=""
                      loading="lazy"
                      className="size-6 rounded object-cover"
                    />
                    {a.name}
                  </Link>
                  <p
                    className="tabular text-lg font-bold"
                    style={{ color: a.accent }}
                  >
                    {ins.metric}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
