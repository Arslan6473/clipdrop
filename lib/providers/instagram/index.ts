import "server-only";

import { createMetadataOnlyProvider } from "../oembed";

/**
 * Instagram metadata requires Meta's oEmbed Read API (an app access token). Without one the
 * provider reports that this source is unavailable. Meta provides no download mechanism.
 */
export const instagramProvider = createMetadataOnlyProvider({
  source: "instagram",
  endpoint: (url) => {
    const token = process.env.META_OEMBED_ACCESS_TOKEN;
    if (!token) return null;
    return `https://graph.facebook.com/v21.0/instagram_oembed?omitscript=true&url=${encodeURIComponent(url.href)}`;
  },
  headers: () => ({ authorization: `Bearer ${process.env.META_OEMBED_ACCESS_TOKEN}` }),
});
