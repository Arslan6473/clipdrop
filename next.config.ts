import type { NextConfig } from "next";
import { THUMBNAIL_HOSTS } from "./lib/config/remote-images";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: THUMBNAIL_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
    formats: ["image/avif", "image/webp"],
  },
  // Tools that were removed: send old links and search results to the universal downloader.
  async redirects() {
    return ["/twitter-video-downloader", "/vimeo-downloader", "/reddit-video-downloader"].map((source) => ({
      source,
      destination: "/universal-video-downloader",
      permanent: true,
    }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
