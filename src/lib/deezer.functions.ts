import { createServerFn } from "@tanstack/react-start";

export type DeezerLive = {
  found: boolean;
  id?: number;
  name?: string;
  nbFan?: number;
  nbAlbum?: number;
  picture?: string;
  link?: string;
  topTracks?: Array<{ id: number; title: string; rank: number; preview: string; album: string }>;
};

/**
 * Fetches a lightweight live snapshot from the Deezer public API
 * (no auth required). Used as a first real data source pending
 * Believe Backstage / Spotify for Artists connectors.
 */
export const getDeezerLive = createServerFn({ method: "GET" })
  .inputValidator((input: { q: string }) => input)
  .handler(async ({ data }): Promise<DeezerLive> => {
    const q = data.q.trim();
    if (!q) return { found: false };
    try {
      const searchRes = await fetch(
        `https://api.deezer.com/search/artist?q=${encodeURIComponent(q)}&limit=1`,
      );
      if (!searchRes.ok) return { found: false };
      const searchJson = (await searchRes.json()) as {
        data?: Array<{
          id: number;
          name: string;
          nb_fan: number;
          nb_album: number;
          picture_xl: string;
          link: string;
        }>;
      };
      const artist = searchJson.data?.[0];
      if (!artist) return { found: false };

      let topTracks: DeezerLive["topTracks"] = [];
      try {
        const topRes = await fetch(
          `https://api.deezer.com/artist/${artist.id}/top?limit=5`,
        );
        if (topRes.ok) {
          const topJson = (await topRes.json()) as {
            data?: Array<{
              id: number;
              title: string;
              rank: number;
              preview: string;
              album: { title: string };
            }>;
          };
          topTracks =
            topJson.data?.map((t) => ({
              id: t.id,
              title: t.title,
              rank: t.rank,
              preview: t.preview,
              album: t.album?.title ?? "",
            })) ?? [];
        }
      } catch {
        // best-effort — top tracks are optional
      }

      return {
        found: true,
        id: artist.id,
        name: artist.name,
        nbFan: artist.nb_fan,
        nbAlbum: artist.nb_album,
        picture: artist.picture_xl,
        link: artist.link,
        topTracks,
      };
    } catch {
      return { found: false };
    }
  });
