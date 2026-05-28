import { Link } from "@tanstack/react-router";
import { Search, Bell } from "lucide-react";

const NAV = [
  { to: "/", label: "Charts" },
  { to: "/roster", label: "Roster" },
  { to: "/tours", label: "Tours" },
  { to: "/insights", label: "Insights" },
] as const;

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-baseline gap-1.5">
            <span className="display-tight text-xl">#NP</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Intelligence
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-[13px] font-medium md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                className="relative rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:text-foreground"
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={
                        "pointer-events-none absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-[color:var(--pop)] transition-transform duration-300 " +
                        (isActive ? "scale-x-100" : "scale-x-0")
                      }
                    />
                  </>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="size-4" strokeWidth={2.25} />
          </button>
          <button className="hidden h-9 items-center gap-2 rounded-full bg-foreground px-4 text-[12px] font-semibold text-background transition-opacity hover:opacity-90 sm:inline-flex">
            <Bell className="size-3.5" strokeWidth={2.5} />
            3 Alerts
          </button>
          <div className="grid size-9 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background">
            PN
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-[var(--ink)] text-white/70">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center lg:px-12">
        <div className="flex items-baseline gap-2">
          <span className="display-tight text-lg text-white">#NP</span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/50">
            Intelligence · v0.3
          </span>
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          © Hashtag NP · Live Nation France · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
