import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

const NAV = [
  { to: "/", label: "Charts" },
  { to: "/roster", label: "Roster" },
  { to: "/tours", label: "Tours" },
  { to: "/insights", label: "Insights" },
] as const;

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="display-tight text-[17px] tracking-tight">#NP</span>
            <span className="micro text-[9px]">Intelligence</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[12px] md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                className="text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search className="size-4" strokeWidth={1.75} />
          </button>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            Semaine 48
          </span>
          <div className="grid size-8 place-items-center rounded-full border border-line text-[10px] font-semibold">
            PN
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center lg:px-12">
        <div className="flex items-baseline gap-3">
          <span className="display-tight text-[15px]">#NP</span>
          <span className="micro text-[9px]">Intelligence · v0.4</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Hashtag NP · Live Nation France · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
