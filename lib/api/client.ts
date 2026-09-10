import { sleep } from "@/lib/utils";
import type { ApiError } from "./types";

/** Simulated round-trip time so loading states are actually visible. */
const LATENCY_RANGE_MS = { min: 600, max: 1200 } as const;

function randomLatency(): number {
  const { min, max } = LATENCY_RANGE_MS;
  return Math.floor(min + Math.random() * (max - min));
}

/** Build a typed ApiError. */
export function apiError(
  status: number,
  message: string,
  fieldErrors?: Record<string, string>,
): ApiError {
  return { status, message, fieldErrors };
}

/** Type guard: narrow an unknown caught value to ApiError. */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}

/**
 * Wrap a mock handler with network latency. Handlers throw `apiError(...)` to
 * simulate a non-2xx response, exactly like a real fetch wrapper would reject.
 */
export async function mockRequest<T>(handler: () => T): Promise<T> {
  await sleep(randomLatency());
  return handler();
}
