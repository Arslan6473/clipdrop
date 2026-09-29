import "server-only";

import { AsyncLocalStorage } from "node:async_hooks";

/** Per-request data providers may need (e.g. to forward the visitor's IP for rate limiting). */
export const requestContext = new AsyncLocalStorage<{ clientIp: string }>();
