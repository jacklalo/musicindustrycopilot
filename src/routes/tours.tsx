import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { TopNav, Footer } from "@/components/TopNav";
import { ROSTER } from "@/lib/roster";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Tours — #NP Intelligence" },
      {
        name: "description",
        content:
          "Agenda live du roster Hashtag NP : Zéniths, stades, festivals — tournées en cours et chaleur de la demande.",
      },
      { property: "og:title", content: "Tours — Hashtag NP" },
      {
        property: "og:description",
        content: "Agenda live, tournées, festivals — #NP.",
      },
    ],
  }),
  component: ToursPage,
});

type Show = {
  artistSlug: string;
  city: string;
  venue: string;
  date: string; // ISO
  status: "complet" | "limité" | "ouverture";
};

const SHOWS: Show[] = [
  { artistSlug: "zazie", city: "Paris", venue: "Accor Arena", date: "2026-06-12", status: "complet" },
  { artistSlug: "zazie", city: "Lyon", venue: "Halle Tony Garnier", date: "2026-06-21", status: "limité" },
  { artistSlug: "zazie", city: "Bruxelles", venue: "Forest National", date: "2026-09-04", status: "ouverture" },
  { artistSlug: "jeremy-frerot", city: "Bordeaux", venue: "Arkéa Arena", date: "2026-06-27", status: "complet" },
  { artistSlug: "jeremy-frerot", city: "Toulouse", venue: "Zénith", date: "2026-07-05", status: "limité" },
  { artistSlug: "jeremy-frerot", city: "Nantes", venue: "Zénith Métropole", date: "2026-06-15", status: "ouverture" },
  { artistSlug: "skip-the-use", city: "Lille", venue: "Zénith Arena", date: "2026-07-02", status: "limité" },
  { artistSlug: "skip-the-use", city: "Paris", venue: "L'Olympia", date: "2026-07-09", status: "ouverture" },
  { artistSlug: "hina", city: "Paris", venue: "La Cigale", date: "2026-06-18", status: "complet" },
  { artistSlug: "hina", city: "Avignon", venue: "Festival OFF", date: "2026-07-12", status: "limité" },
  { artistSlug: "virgile-martini", city: "Paris", venue: "Le Pop-Up!", date: "2026-09-11", status: "ouverture" },
  { artistSlug: "nabil-harlow", city: "Paris", venue: "Le Trianon", date: "2026-06-25", status: "limité" },
  { artistSlug: "lancelot", city: "Lyon", venue: "Le Transbordeur", date: "2026-06-14", status: "limité" },
  { artistSlug: "lancelot", city: "Paris", venue: "La Cigale", date: "2026-09-22", status: "ouverture" },
  { artistSlug: "kimberose", city: "Paris", venue: "Le Bataclan", date: "2026-07-03", status: "ouverture" },
  { artistSlug: "lubiana", city: "Paris", venue: "Le Café de la Danse", date: "2026-06-10", status: "limité" },
];

const STATUS_STYLE: Record<Show["status"], string> = {
  complet: "bg-rose-50 text-rose-700 border-rose-200",
  limité: "bg-amber-50 text-amber-700 border-amber-200",
  ouverture: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function ToursPage() {
  const totalDates = ROSTER.reduce((s, a) => s + a.tourDates, 0);
  const sortedShows = [...SHOWS].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      <header className="border-b border-line bg-[var(--ink)] text-white">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 lg:px-12 lg:py-20">
          <div className="md:col-span-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
              Live · Été — Automne 2026
            </p>
            <h1 className="display-tight mt-4 text-[clamp(40px,7vw,88px)] leading-[0.95] text-balance">
              Tours <span className="italic text-white/60">en cours</span>.
            </h1>
            <p className="mt-5 max-w-[58ch] text-white/65">
              Salles, festivals, stades — la chaleur live du roster #NP en temps réel.
            </p>
          </div>
          <div className="md:col-span-5 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
            <HeroStat label="Dates" value={String(totalDates)} />
            <HeroStat label="Artistes en tournée" value={String(ROSTER.filter((a) => a.tourDates > 0).length)} />
            <HeroStat label="Sold-out" value={String(SHOWS.filter((s) => s.status === "complet").length)} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 pb-32 pt-12 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Calendar list */}
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Prochains shows
              </p>
              <span className="text-[11px] text-muted-foreground">
                {sortedShows.length} dates
              </span>
            </div>
            <ul>
              {sortedShows.map((s, i) => {
                const a = ROSTER.find((r) => r.slug === s.artistSlug)!;
                const d = new Date(s.date);
                const day = d.toLocaleDateString("fr-FR", { day: "2-digit" });
                const month = d
                  .toLocaleDateString("fr-FR", { month: "short" })
                  .replace(".", "");
                return (
                  <li
                    key={i}
                    style={{ ["--row-accent" as string]: a.accent }}
                    className="group relative grid grid-cols-12 items-center gap-4 rounded-2xl border border-transparent py-5 pl-3 pr-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:bg-foreground/[0.04] hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)]"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-full bg-foreground/20 transition-transform duration-300 group-hover:scale-y-100"
                    />

                    <div className="col-span-2 sm:col-span-1">
                      <p className="tabular text-2xl font-semibold leading-none">
                        {day}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {month}
                      </p>
                    </div>
                    <Link
                      to="/artists/$slug"
                      params={{ slug: a.slug }}
                      className="col-span-5 flex items-center gap-3 sm:col-span-5"
                    >
                      <img
                        src={a.cover}
                        alt=""
                        loading="lazy"
                        className="size-11 rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold leading-tight transition-colors group-hover:text-foreground">
                          {a.name}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {a.genre}
                        </p>
                      </div>
                    </Link>
                    <div className="col-span-3 hidden text-[12px] text-foreground/80 sm:block">
                      <p className="font-medium">{s.venue}</p>
                      <p className="text-muted-foreground">
                        <MapPin className="mr-1 inline size-3" />
                        {s.city}
                      </p>
                    </div>
                    <div className="col-span-5 flex items-center justify-end gap-2 sm:col-span-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLE[s.status]}`}
                      >
                        {s.status}
                      </span>
                      <button
                        onClick={() => toast(`Billetterie ${a.name} · ${s.venue}`)}
                        className="hidden h-8 items-center gap-1.5 rounded-full bg-foreground px-3 text-[11px] font-semibold text-background opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 sm:inline-flex"
                      >
                        Voir
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Heatmap / Demand */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-3xl border border-line bg-card p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Chaleur de la demande
                </p>
                <h3 className="display-tight mt-2 text-2xl">Top villes — 7j</h3>
                <ul className="mt-5 space-y-3">
                  {[
                    { city: "Paris", pct: 100, color: "#ED2362" },
                    { city: "Lyon", pct: 78, color: "#1E5BFF" },
                    { city: "Bordeaux", pct: 64, color: "#5A8DB8" },
                    { city: "Bruxelles", pct: 52, color: "#2DE07A" },
                    { city: "Montréal", pct: 41, color: "#C8102E" },
                  ].map((row) => (
                    <li key={row.city}>
                      <div className="flex items-baseline justify-between text-[12px]">
                        <span className="font-medium">{row.city}</span>
                        <span className="tabular text-muted-foreground">
                          {row.pct}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <span
                          className="block h-full rounded-full transition-all"
                          style={{
                            width: `${row.pct}%`,
                            background: row.color,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-line bg-[var(--ink)] p-6 text-white">
                <Calendar className="size-5 text-white/70" />
                <h3 className="display-tight mt-3 text-xl text-balance">
                  Festival d'été — recommandation
                </h3>
                <p className="mt-2 text-[13px] text-white/65">
                  La demande tour-model suggère d'ajouter <strong>Hina</strong>{" "}
                  sur les festivals OFF d'Avignon + Vieilles Charrues — fenêtre
                  optimale juin / juillet.
                </p>
                <Link
                  to="/insights"
                  className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-white"
                >
                  Lire l'analyse <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--ink)] p-5">
      <p className="tabular text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">
        {label}
      </p>
    </div>
  );
}
