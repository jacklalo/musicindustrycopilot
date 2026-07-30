import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import rawHtml from "@/prototype/np.html?raw";

const styleMatch = rawHtml.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = rawHtml.match(/<body>([\s\S]*?)<\/body>/);
const scriptMatch = rawHtml.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);

const PROTO_CSS = styleMatch ? styleMatch[1] : "";
const PROTO_SCRIPT = scriptMatch ? scriptMatch[1] : "";
const PROTO_BODY = (bodyMatch ? bodyMatch[1] : "").replace(
  /<script>[\s\S]*?<\/script>/g,
  "",
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "#NP Pilotage — Dashboard Artiste" },
      {
        name: "description",
        content:
          "Cockpit de pilotage #NP : streaming, radio, social, physique et alertes hebdomadaires pour le roster 6&7 et Syndicate Records.",
      },
      { property: "og:title", content: "#NP Pilotage — Dashboard Artiste" },
      {
        property: "og:description",
        content:
          "Pilotage hebdomadaire du roster #NP : streams, Shazam, playlists, radio et alertes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrototypePage,
});

function PrototypePage() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const el = document.createElement("script");
    el.textContent = PROTO_SCRIPT;
    document.body.appendChild(el);
    return () => {
      el.remove();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PROTO_CSS }} />
      <div className="np-proto" dangerouslySetInnerHTML={{ __html: PROTO_BODY }} />
    </>
  );
}
