import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, Footer } from "@/components/TopNav";
import { ROSTER } from "@/lib/roster";

export const Route = createFileRoute("/roster")({
  head: () => ({
    meta: [
      { title: "Roster — #NP Intelligence" },
      {
        name: "description",
        content:
          "Les artistes signés Hashtag NP : Mylène Farmer, Julien Clerc, -M-, Jérémy Frerot, Suzane, KLON, Lancelot et plus.",
      },
      { property: "og:title", content: "Roster — Hashtag NP" },
      {
        property: "og:description",
        content: "Tous les artistes managés par #NP en un coup d'œil.",
      },
    ],
  }),
  component: RosterPage,
});

function RosterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      <header className="border-b border-line">
        <div className="mx-auto max-w-[1320px] px-6 pb-16 pt-20 lg:px-12 lg:pb-20 lg:pt-28">
          <p className="micro">Le catalogue · {ROSTER.length} artistes</p>
          <h1 className="mt-5 text-[clamp(56px,9vw,128px)] leading-[0.88] tracking-[-0.04em] text-balance">
            <span className="display-serif italic text-muted-foreground">The </span>
            <span className="display-tight">family.</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
            Une famille d'artistes francophones — icônes installées et talents
            émergents, développés en partenariat avec Live Nation France.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-6 pb-20 lg:px-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 pt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ROSTER.map((a) => (
            <Link
              key={a.slug}
              to="/artists/$slug"
              params={{ slug: a.slug }}
              className="group block"
            >
              <div className="grain-card relative aspect-square overflow-hidden border border-line">
                <img
                  src={a.cover}
                  alt={a.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <p className="micro">N°{String(a.rank).padStart(2, "0")}</p>
                <p className="tabular text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {a.delta >= 0 ? "+" : ""}
                  {a.delta.toFixed(1)}
                </p>
              </div>
              <p className="display-serif mt-1.5 text-[22px] leading-tight">
                {a.name}
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {a.genre} · {a.city}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
