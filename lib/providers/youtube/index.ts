import "server-only";

import { createMetadataOnlyProvider } from "../oembed";

/**
 * YouTube offers no public download API for third parties, so this provider identifies the
 * video via YouTube's public oEmbed endpoint and reports that downloads aren't available.
 */
export const youtubeProvider = createMetadataOnlyProvider({
  source: "youtube",
  endpoint: (url) => `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url.href)}`,
});
