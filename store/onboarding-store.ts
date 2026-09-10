import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  INITIAL_ONBOARDING_DATA,
  type OnboardingData,
  type StepKey,
} from "@/types/onboarding";

interface OnboardingState {
  /** Data collected across steps; survives Back/Forward and refresh. */
  data: OnboardingData;
  /** Steps the user chose to skip, reflected in the progress bar + summary. */
  skipped: StepKey[];
  updateData: (fields: Partial<OnboardingData>) => void;
  markSkipped: (step: StepKey) => void;
  reset: () => void;
}

/**
 * Single flow store (AGENTS.md §11). Persisted to sessionStorage so a refresh
 * keeps entered data; navigation is always done through `useOnboarding`.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      data: INITIAL_ONBOARDING_DATA,
      skipped: [],
      updateData: (fields) =>
        set((state) => ({ data: { ...state.data, ...fields } })),
      markSkipped: (step) =>
        set((state) => ({
          skipped: state.skipped.includes(step)
            ? state.skipped
            : [...state.skipped, step],
        })),
      reset: () => set({ data: INITIAL_ONBOARDING_DATA, skipped: [] }),
    }),
    {
      name: "onboarding-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ data: state.data, skipped: state.skipped }),
    },
  ),
);
