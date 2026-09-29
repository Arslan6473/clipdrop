const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
const MAX_BASE_LENGTH = 120;

/**
 * Produces a safe, cross-platform filename: strips path separators, traversal sequences,
 * control and reserved characters, and caps length. The extension is whitelisted.
 */
export function sanitizeFilename(name: string, extension = "mp4", fallback = "video"): string {
  const ext = /^[a-z0-9]{1,5}$/i.test(extension) ? extension.toLowerCase() : "mp4";

  let base = (name ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
    .replace(/[​-‏‪-‮⁦-⁩﻿]/g, "") // zero-width + bidi overrides
    .replace(/[<>:"/\\|?*]/g, " ")
    .replace(/\.{2,}/g, ".")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[.\s-]+|[.\s]+$/g, "");

  if (base.length > MAX_BASE_LENGTH) base = base.slice(0, MAX_BASE_LENGTH).trim();
  if (!base || WINDOWS_RESERVED.test(base)) base = fallback;

  return `${base}.${ext}`;
}
