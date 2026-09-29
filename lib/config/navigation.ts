import { PLATFORMS, TOOL_LINKS, type PlatformId } from "@/lib/platforms/platforms";

export interface NavLink {
  name: string;
  href: string;
  platform?: PlatformId;
}

const platformLink = (id: PlatformId): NavLink => ({ name: PLATFORMS[id].name, href: PLATFORMS[id].href, platform: id });

export const PRIMARY_NAV: NavLink[] = (["youtube", "instagram", "tiktok", "facebook"] as const).map(platformLink);
export const ALL_PLATFORM_LINKS: NavLink[] = PRIMARY_NAV;
export const TOOL_NAV: NavLink[] = TOOL_LINKS.map((t) => ({ name: t.name, href: t.href }));
