import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
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

      <header className="border-b border-line bg-[var(--ink)] text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
            Le catalogue · {ROSTER.length} artistes
          </p>
          <h1 className="display-tight mt-4 text-[clamp(40px,7vw,88px)] leading-[0.95] text-balance">
            Roster <span className="italic text-white/55">#NP</span>
          </h1>
          <p className="mt-5 max-w-[60ch] text-white/65">
            Une famille d'artistes francophones — icônes installées et talents émergents
            développés en partenariat avec Live Nation France.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 pb-32 lg:px-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 pt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ROSTER.map((a) => (
            <Link
              key={a.slug}
              to="/artists/$slug"
              params={{ slug: a.slug }}
              className="group block transition-transform duration-300 hover:-translate-y-1"
            >
              <div
                className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-black/5 transition-shadow duration-300 group-hover:shadow-[0_30px_60px_-30px_var(--card-accent)]"
                style={{
                  background: a.accent + "10",
                  ["--card-accent" as string]: a.accent,
                }}
              >
                <img
                  src={a.cover}
                  alt={a.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to top, ${a.accent}CC, transparent)`,
                  }}
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: a.accent }}
                  />
                  #{String(a.rank).padStart(2, "0")}
                </span>
                <span className="absolute right-3 top-3 grid size-9 translate-y-2 place-items-center rounded-full bg-white/95 text-black opacity-0 shadow-lg ring-1 ring-black/10 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" strokeWidth={2.25} />
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold leading-tight">
                    {a.name}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                    {a.genre} · {a.city}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="tabular font-medium text-foreground/80">
                  {a.streams}
                </span>
                <span className="size-1 rounded-full bg-line" />
                <span
                  className="tabular font-semibold"
                  style={{ color: a.delta >= 0 ? a.accent : "rgb(225 29 72)" }}
                >
                  {a.delta >= 0 ? "+" : ""}
                  {a.delta.toFixed(1)}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
