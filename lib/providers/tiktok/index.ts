import "server-only";

import { createMetadataOnlyProvider } from "../oembed";

/**
 * TikTok's public oEmbed endpoint provides metadata. TikTok's download APIs are limited to
 * a creator's own content via user authorisation, so no downloads are offered here.
 */
export const tiktokProvider = createMetadataOnlyProvider({
  source: "tiktok",
  endpoint: (url) => `https://www.tiktok.com/oembed?url=${encodeURIComponent(url.href)}`,
});
