import "server-only";

import { createMetadataOnlyProvider } from "../oembed";

/**
 * Facebook video metadata requires Meta's oEmbed Read API (an app access token). Without one the
 * provider reports that this source is unavailable. Meta provides no download mechanism.
 */
export const facebookProvider = createMetadataOnlyProvider({
  source: "facebook",
  endpoint: (url) => {
    const token = process.env.META_OEMBED_ACCESS_TOKEN;
    if (!token) return null;
    return `https://graph.facebook.com/v21.0/oembed_video?omitscript=true&url=${encodeURIComponent(url.href)}`;
  },
  headers: () => ({ authorization: `Bearer ${process.env.META_OEMBED_ACCESS_TOKEN}` }),
});
