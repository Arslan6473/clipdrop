import { z } from "zod";
import { MAX_URL_LENGTH } from "@/lib/platforms/normalize-url";

/** Zod schemas for API request bodies. */
export const analyzeRequestSchema = z.object({
  url: z.string().trim().min(1).max(MAX_URL_LENGTH),
});

export const downloadRequestSchema = z.object({
  url: z.string().trim().min(1).max(MAX_URL_LENGTH),
  formatId: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_.-]+$/),
});
