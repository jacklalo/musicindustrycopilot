import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ArrowUp, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toast } from "sonner";
import { TopNav, Footer } from "@/components/TopNav";
import { ROSTER, type Artist } from "@/lib/roster";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask · #NP Intelligence" },
      {
        name: "description",
        content:
          "Posez n'importe quelle question sur votre roster : streaming, social, live, radio. Réponses synthétiques et sourcées.",
      },
      { property: "og:title", content: "Ask · #NP Intelligence" },
      {
        property: "og:description",
        content:
          "Interrogez le roster #NP en langage naturel — streaming, social, tour, radio.",
      },
    ],
  }),
  component: AskPage,
});

type Trend = "up" | "down" | "flat";

type ArtistCard = {
  slug: string;
  metric: string;
  detail: string;
  trend?: Trend;
};

type QA = {
  q: string;
  a: string;
  sources?: string[];
  cards?: ArtistCard[];
};

const byslug = (slug: string): Artist | undefined =>
  ROSTER.find((a) => a.slug === slug);

const QUICK_QA: QA[] = [
  {
    q: "Quel artiste accélère cette semaine ?",
    a: "Zazie mène le roster cette semaine avec +18% de streams hebdo, portée par la playlist « Nouvelle Scène FR ». Skip the Use suit avec un pic Shazam en Belgique (+540 en 24h).",
    cards: [
      { slug: "zazie", metric: "+18% streams", detail: "Rising · Playlist Nouvelle Scène FR", trend: "up" },
      { slug: "skip-the-use", metric: "+540 Shazams/j", detail: "Viral · Belgique", trend: "up" },
      { slug: "hina", metric: "+9% saves", detail: "Rising · TikTok FR", trend: "up" },
    ],
    sources: ["Spotify", "Shazam", "TikTok"],
  },
  {
    q: "Compare Zazie et Jérémy Frerot sur 30 jours",
    a: "Sur 30 jours, Zazie génère 4.2M streams (+12%) contre 3.1M pour Jérémy Frerot (+4%). Zazie sur-performe en France urbaine ; Frerot conserve un socle radio plus large (NRJ, Chérie).",
    cards: [
      { slug: "zazie", metric: "4.2M streams", detail: "+12% · Urbain FR", trend: "up" },
      { slug: "jeremy-frerot", metric: "3.1M streams", detail: "+4% · Radio NRJ / Chérie", trend: "up" },
    ],
    sources: ["Believe", "Yacast", "Meta"],
  },
  {
    q: "Où booker Skip the Use en tournée ?",
    a: "Fenêtre optimale : Belgique et Nord-Est FR. Concentration d'auditeurs mensuels à Bruxelles, Lille, Metz, Strasbourg. Momentum Shazam belge en pic depuis 12 jours.",
    cards: [
      { slug: "skip-the-use", metric: "42k · Bruxelles", detail: "Botanique / AB", trend: "up" },
      { slug: "skip-the-use", metric: "31k · Lille", detail: "Aéronef", trend: "up" },
      { slug: "skip-the-use", metric: "22k · Strasbourg", detail: "La Laiterie", trend: "flat" },
    ],
    sources: ["Spotify for Artists", "Bandsintown", "Shazam"],
  },
  {
    q: "Alertes streaming des 7 derniers jours",
    a: "3 alertes actives sur le seuil ±20%. Une viralité positive à surveiller, une chute à investiguer côté playlist.",
    cards: [
      { slug: "hina", metric: "+34% streams", detail: "Nouveau pitch éditorial", trend: "up" },
      { slug: "krisy", metric: "+22% streams", detail: "Sync pub retail", trend: "up" },
      { slug: "lancelot", metric: "−24% streams", detail: "Sortie playlist Hits FR", trend: "down" },
    ],
    sources: ["Believe", "Spotify"],
  },
  {
    q: "Résume la performance du label 6&7",
    a: "Label 6&7 en croissance nette : +8.4% streams agrégés semaine, portés par Zazie et Hina. Social stable, tour pipeline solide (7 dates confirmées Q1).",
    cards: [
      { slug: "zazie", metric: "+18% streams", detail: "Locomotive label", trend: "up" },
      { slug: "hina", metric: "+34% streams", detail: "Emerging viral", trend: "up" },
      { slug: "jeremy-frerot", metric: "7 dates Q1", detail: "Tour pipeline", trend: "flat" },
    ],
    sources: ["Believe", "Meta", "Bandsintown"],
  },
];

function TrendIcon({ trend }: { trend?: Trend }) {
  if (trend === "up")
    return <TrendingUp className="size-3.5" strokeWidth={2.5} />;
  if (trend === "down")
    return <TrendingDown className="size-3.5" strokeWidth={2.5} />;
  return <Minus className="size-3.5" strokeWidth={2.5} />;
}

function trendClass(trend?: Trend) {
  if (trend === "up") return "text-emerald-600";
  if (trend === "down") return "text-red-600";
  return "text-foreground/50";
}

function ArtistResultCard({ card }: { card: ArtistCard }) {
  const artist = byslug(card.slug);
  if (!artist) return null;
  return (
    <Link
      to="/artists/$slug"
      params={{ slug: artist.slug }}
      className="group flex items-center gap-3 rounded-xl border border-line bg-background p-2 pr-3 transition-all hover:border-foreground/30 hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.15)]"
    >
      <div
        className="relative size-12 flex-shrink-0 overflow-hidden rounded-lg"
        style={{ backgroundColor: artist.accent }}
      >
        <img
          src={artist.cover}
          alt={artist.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-foreground">
          {artist.name}
        </div>
        <div
          className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold ${trendClass(
            card.trend,
          )}`}
        >
          <TrendIcon trend={card.trend} />
          <span className="truncate">{card.metric}</span>
        </div>
        <div className="truncate text-[11px] text-foreground/50">
          {card.detail} · {artist.genre}
        </div>
      </div>
    </Link>
  );
}

function AskPage() {
  const [value, setValue] = useState("");
  const [answer, setAnswer] = useState<QA | null>(null);
  const [typed, setTyped] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!answer) return;
    setTyped("");
    setLoading(true);
    let i = 0;
    const full = answer.a;
    const id = window.setInterval(() => {
      i += 2;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(id);
        setLoading(false);
      }
    }, 14);
    return () => window.clearInterval(id);
  }, [answer]);

  const submit = (q: string) => {
    const query = q.trim();
    if (!query) return;
    const match = QUICK_QA.find((x) => x.q === query);
    setAnswer(
      match ?? {
        q: query,
        a: "Je synthétise les signaux du roster (streaming, social, live, radio) pour répondre à cette question. Branchez les connecteurs Believe et Spotify for Artists pour une réponse chiffrée en temps réel.",
        sources: ["Believe", "Spotify", "Meta"],
      },
    );
    setValue("");
  };

  const reset = () => {
    setAnswer(null);
    setTyped("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-[900px] px-6 py-20 lg:py-28">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/50">
            <Sparkles className="size-3" />
            #NP Intelligence
          </div>
          <h1 className="display-tight text-[clamp(32px,5vw,56px)] leading-[1.02] text-balance">
            Demandez n'importe quoi<br />sur votre roster.
          </h1>
          <p className="max-w-[520px] text-sm text-foreground/60">
            Une question en langage naturel. Une réponse chiffrée, sourcée, prête à
            partager au management.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
            className="w-full"
          >
            <div className="group relative flex items-center rounded-2xl border border-line bg-card px-2 py-2 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all focus-within:border-foreground/40 focus-within:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)]">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Posez une question à #NP Intelligence…"
                className="flex-1 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!value.trim()}
                className="grid size-10 place-items-center rounded-xl bg-[var(--ink)] text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
                aria-label="Envoyer"
              >
                <ArrowUp className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          </form>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {QUICK_QA.map((item) => {
              const active = answer?.q === item.q;
              return (
                <button
                  key={item.q}
                  onClick={() => submit(item.q)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                    active
                      ? "border-foreground/40 bg-foreground text-background"
                      : "border-line bg-card text-foreground/70 hover:border-foreground/30 hover:bg-foreground/[0.03] hover:text-foreground"
                  }`}
                >
                  {item.q}
                </button>
              );
            })}
          </div>

          {answer && (
            <div
              key={answer.q}
              className="mt-4 w-full animate-in fade-in slide-in-from-top-2 duration-500"
            >
              <div className="flex items-start gap-4 rounded-2xl border border-line bg-foreground/[0.02] p-5 text-left">
                <div className="mt-0.5 grid size-8 flex-shrink-0 place-items-center rounded-lg bg-[var(--ink)] text-[10px] font-bold tracking-wider text-white">
                  NP
                </div>
                <div className="flex-1 space-y-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                    Réponse · {answer.q}
                  </div>
                  <p className="text-[15px] leading-relaxed text-foreground">
                    {typed}
                    {loading && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-foreground/60 align-middle" />
                    )}
                  </p>

                  {!loading && answer.cards && answer.cards.length > 0 && (
                    <div className="grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
                      {answer.cards.map((c, i) => (
                        <div
                          key={`${c.slug}-${i}`}
                          style={{ animationDelay: `${i * 80}ms` }}
                          className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both"
                        >
                          <ArtistResultCard card={c} />
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {answer.sources?.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-line bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground/60"
                        >
                          {s}
                        </span>
                      ))}
                      <div className="ml-auto flex items-center gap-3 text-[11px]">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(answer.a);
                            toast("Réponse copiée");
                          }}
                          className="font-medium text-foreground/40 transition-colors hover:text-foreground"
                        >
                          Copier
                        </button>
                        <button
                          onClick={reset}
                          className="font-medium text-foreground/40 transition-colors hover:text-foreground"
                        >
                          Nouvelle question
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
