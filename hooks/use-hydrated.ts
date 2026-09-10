"use client";

import { useSyncExternalStore } from "react";
import { useOnboardingStore } from "@/store/onboarding-store";

// Stable references so useSyncExternalStore does not re-subscribe every render.
function subscribe(onStoreChange: () => void): () => void {
  return useOnboardingStore.persist.onFinishHydration(() => onStoreChange());
}

function getSnapshot(): boolean {
  return useOnboardingStore.persist.hasHydrated();
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Returns true once the persisted store has rehydrated on the client.
 *
 * Screens that read persisted data gate on this to avoid an SSR/CSR hydration
 * mismatch (the server renders with empty sessionStorage). While it is false,
 * render a loading skeleton — which doubles as the screen's loading state.
 *
 * Built on `useSyncExternalStore` (not an effect + setState) so it is safe under
 * the React Compiler and concurrent rendering.
 */
export function useOnboardingHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
