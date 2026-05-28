import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
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
  date: string;
  status: "complet" | "limité" | "ouverture";
};

const SHOWS: Show[] = [
  { artistSlug: "mylene-farmer", city: "Paris", venue: "La Défense Arena", date: "2026-06-12", status: "complet" },
  { artistSlug: "mylene-farmer", city: "Lyon", venue: "Groupama Stadium", date: "2026-06-21", status: "complet" },
  { artistSlug: "mylene-farmer", city: "Montréal", venue: "Bell Centre", date: "2026-09-04", status: "limité" },
  { artistSlug: "julien-clerc", city: "Bordeaux", venue: "Arkéa Arena", date: "2026-06-08", status: "limité" },
  { artistSlug: "julien-clerc", city: "Nantes", venue: "Zénith Métropole", date: "2026-06-15", status: "ouverture" },
  { artistSlug: "matthieu-chedid", city: "Paris", venue: "Accor Arena", date: "2026-07-02", status: "limité" },
  { artistSlug: "matthieu-chedid", city: "Bruxelles", venue: "Forest National", date: "2026-07-09", status: "ouverture" },
  { artistSlug: "jeremy-frerot", city: "Bordeaux", venue: "Arkéa Arena", date: "2026-06-27", status: "complet" },
  { artistSlug: "jeremy-frerot", city: "Toulouse", venue: "Zénith", date: "2026-07-05", status: "limité" },
  { artistSlug: "suzane", city: "Paris", venue: "Olympia", date: "2026-06-18", status: "complet" },
  { artistSlug: "suzane", city: "Avignon", venue: "Festival OFF", date: "2026-07-12", status: "limité" },
  { artistSlug: "klon", city: "Paris", venue: "L'Olympia", date: "2026-09-11", status: "ouverture" },
  { artistSlug: "nabil-harlow", city: "Paris", venue: "Le Trianon", date: "2026-06-25", status: "limité" },
  { artistSlug: "lancelot", city: "Lyon", venue: "Le Transbordeur", date: "2026-06-14", status: "limité" },
  { artistSlug: "lancelot", city: "Paris", venue: "La Cigale", date: "2026-09-22", status: "ouverture" },
  { artistSlug: "waxx-c-cole", city: "Paris", venue: "New Morning", date: "2026-07-03", status: "ouverture" },
];

function statusDot(s: Show["status"]) {
  return s === "complet"
    ? "bg-foreground"
    : s === "limité"
      ? "bg-foreground/45"
      : "bg-transparent ring-1 ring-foreground/40";
}

function ToursPage() {
  const totalDates = ROSTER.reduce((s, a) => s + a.tourDates, 0);
  const sortedShows = [...SHOWS].sort((a, b) => a.date.localeCompare(b.date));
  const soldOut = SHOWS.filter((s) => s.status === "complet").length;
  const touring = ROSTER.filter((a) => a.tourDates > 0).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      <header className="border-b border-line">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-end gap-12 px-6 pb-16 pt-20 md:grid-cols-12 lg:px-12 lg:pb-20 lg:pt-28">
          <div className="md:col-span-8">
            <p className="micro">Live · Été — Automne 2026</p>
            <h1 className="mt-5 text-[clamp(56px,9vw,128px)] leading-[0.88] tracking-[-0.04em] text-balance">
              <span className="display-serif italic text-muted-foreground">On </span>
              <span className="display-tight">tour.</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
              Salles, festivals, stades. La chaleur scène du roster #NP — restituée
              date par date, sans tableaux de bord superflus.
            </p>
          </div>
          <div className="md:col-span-4 grid grid-cols-3 border-y border-line">
            <HeroStat label="Dates" value={String(totalDates)} />
            <HeroStat label="Artistes" value={String(touring)} divider />
            <HeroStat label="Sold-out" value={String(soldOut)} divider />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-6 pb-20 pt-14 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Agenda */}
          <section className="lg:col-span-8">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <p className="micro">Prochains shows</p>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
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
                    className="group grid grid-cols-12 items-center gap-4 border-b border-line py-5 transition-colors hover:bg-[color:var(--surface)]"
                  >
                    <div className="col-span-2 sm:col-span-1">
                      <p className="display-serif tabular text-[26px] leading-none">{day}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {month}
                      </p>
                    </div>
                    <Link
                      to="/artists/$slug"
                      params={{ slug: a.slug }}
                      className="col-span-5 flex items-center gap-3"
                    >
                      <img
                        src={a.cover}
                        alt=""
                        loading="lazy"
                        className="size-10 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium leading-tight group-hover:underline">
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
                        <MapPin className="mr-1 inline size-3" strokeWidth={1.75} />
                        {s.city}
                      </p>
                    </div>
                    <div className="col-span-5 flex items-center justify-end gap-2 sm:col-span-3">
                      <span className={`size-1.5 rounded-full ${statusDot(s.status)}`} />
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {s.status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Demand */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20 space-y-12">
              <div>
                <p className="micro">Chaleur de la demande</p>
                <h3 className="display-serif mt-3 text-[28px] leading-tight">
                  Top villes — 7 jours
                </h3>
                <ul className="mt-6 space-y-4">
                  {[
                    { city: "Paris", pct: 100 },
                    { city: "Lyon", pct: 78 },
                    { city: "Bordeaux", pct: 64 },
                    { city: "Bruxelles", pct: 52 },
                    { city: "Montréal", pct: 41 },
                  ].map((row) => (
                    <li key={row.city}>
                      <div className="flex items-baseline justify-between text-[12px]">
                        <span>{row.city}</span>
                        <span className="tabular text-muted-foreground">{row.pct}</span>
                      </div>
                      <div className="mt-1.5 h-px w-full bg-line">
                        <span
                          className="block h-px bg-foreground"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-line pt-8">
                <p className="micro">Recommandation</p>
                <p className="display-serif mt-3 text-[22px] leading-[1.2] text-balance">
                  Ajouter Suzane sur les festivals OFF d'Avignon et Vieilles Charrues — fenêtre optimale juin-juillet.
                </p>
                <Link
                  to="/insights"
                  className="mt-4 inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-[12px] font-medium"
                >
                  Lire l'analyse
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

function HeroStat({
  label,
  value,
  divider,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <div className={`py-5 ${divider ? "border-l border-line pl-4" : ""}`}>
      <p className="display-serif tabular text-[32px] leading-none">{value}</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
