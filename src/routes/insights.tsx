import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
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
      { property: "og:description", content: "Recommandations data du roster #NP." },
    ],
  }),
  component: InsightsPage,
});

type Insight = {
  kicker: string;
  artistSlug: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
};

const INSIGHTS: Insight[] = [
  {
    kicker: "Signal viral",
    artistSlug: "suzane",
    title: "‘Toï Toï’ entre dans le Top 50 Viral France",
    body: "Détecté sur +18k UGC TikTok en 48h. Profil 18-29 dominant, axe Paris–Lyon–Marseille. Recommandation : amplification créateurs + paid social ciblé.",
    metric: "+41.5%",
    metricLabel: "streams 7 jours",
  },
  {
    kicker: "Signal géographique",
    artistSlug: "mylene-farmer",
    title: "Mylène Farmer accélère à Montréal",
    body: "Effet teaser Nevermore II sur Spotify Canada. Le modèle de demande tour suggère l'ouverture d'une seconde date au Bell Centre.",
    metric: "+212%",
    metricLabel: "auditeurs QC",
  },
  {
    kicker: "Catalogue",
    artistSlug: "julien-clerc",
    title: "Vinyle ‘Si on chantait’ — rupture stock 4×",
    body: "Save rate élevé sur les classiques. Repress + bundle merch à arbitrer en amont de la tournée des Zéniths.",
    metric: "×4",
    metricLabel: "demande / stock",
  },
  {
    kicker: "Découverte",
    artistSlug: "virgile-martini",
    title: "Virgile Martini — profil émergent à pousser",
    body: "Taux d'ajout en playlists user multiplié par trois sur 30 jours. Discover Weekly délivre 38% des nouveaux auditeurs.",
    metric: "×3",
    metricLabel: "ajouts playlists",
  },
  {
    kicker: "Live",
    artistSlug: "klon",
    title: "KLON — Olympia : ouverture billetterie",
    body: "Audience 18-24 dominante, 82% des écoutes en Île-de-France. Le sold-out semble probable dans les 72h après ouverture.",
    metric: "82%",
    metricLabel: "audience IDF",
  },
  {
    kicker: "Sync TV / Ciné",
    artistSlug: "era",
    title: "ERA — 4 placements sync ce trimestre",
    body: "Demande forte sur 'The Mass'. Marchés US et UK actifs — opportunité de relance auprès des superviseurs musicaux.",
    metric: "+4",
    metricLabel: "syncs Q4",
  },
];

function InsightsPage() {
  const [featured, ...others] = INSIGHTS;
  const fArtist = ROSTER.find((a) => a.slug === featured.artistSlug)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      <header className="border-b border-line">
        <div className="mx-auto max-w-[1320px] px-6 pb-14 pt-20 lg:px-12 lg:pb-20 lg:pt-28">
          <p className="micro">Insights · mise à jour il y a 4 min</p>
          <h1 className="mt-5 text-[clamp(56px,9vw,128px)] leading-[0.88] tracking-[-0.04em] text-balance">
            <span className="display-serif italic text-muted-foreground">Signals of the </span>
            <span className="display-tight">week.</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
            Les signaux qui méritent une décision — tournée, marketing, catalogue.
            Triés par impact, pas par volume.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-6 pb-20 pt-16 lg:px-12">
        {/* Featured */}
        <article className="grid grid-cols-1 gap-12 border-b border-line pb-20 md:grid-cols-12">
          <Link
            to="/artists/$slug"
            params={{ slug: fArtist.slug }}
            className="grain-card group relative block aspect-square overflow-hidden border border-line md:col-span-5"
          >
            <img
              src={fArtist.cover}
              alt={fArtist.name}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </Link>
          <div className="md:col-span-7 flex flex-col justify-end">
            <p className="micro">{featured.kicker}</p>
            <h2 className="mt-5 text-[clamp(40px,5vw,72px)] leading-[0.95] tracking-[-0.03em] text-balance">
              <span className="display-serif italic text-muted-foreground/80">{featured.title.split(" ").slice(0, 1).join(" ")} </span>
              <span className="display-tight">{featured.title.split(" ").slice(1).join(" ")}</span>
            </h2>
            <p className="mt-6 max-w-[55ch] text-[15px] leading-relaxed text-muted-foreground">
              {featured.body}
            </p>
            <div className="mt-8 flex items-end justify-between border-t border-line pt-6">
              <div>
                <p className="micro">{featured.metricLabel}</p>
                <p className="display-serif tabular mt-1 text-[42px] leading-none">
                  {featured.metric}
                </p>
              </div>
              <Link
                to="/artists/$slug"
                params={{ slug: fArtist.slug }}
                className="inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-[12px] font-medium"
              >
                Fiche {fArtist.name} <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </article>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {others.map((ins, i) => {
            const a = ROSTER.find((r) => r.slug === ins.artistSlug)!;
            return (
              <article key={i} className="group flex flex-col">
                <Link
                  to="/artists/$slug"
                  params={{ slug: a.slug }}
                  className="grain-card relative block aspect-[4/3] overflow-hidden border border-line"
                >
                  <img
                    src={a.cover}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </Link>
                <p className="micro mt-5">{ins.kicker}</p>
                <h3 className="display-serif mt-2 text-[22px] leading-[1.15] text-balance">
                  {ins.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {ins.body}
                </p>
                <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                  <Link
                    to="/artists/$slug"
                    params={{ slug: a.slug }}
                    className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                  >
                    {a.name}
                  </Link>
                  <p className="display-serif tabular text-[22px] leading-none">
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
