import { screens } from './constants'
import { useMediaQuery } from '@vueuse/core'
import { type Ref, computed, unref } from 'vue'

type Screen = keyof typeof screens

/**
 * Exposes Tailwind CSS breakpoints as reactive media queries
 *
 * **Warning:** This hook is not a replacement for Tailwind CSS breakpoints. Using breakpoints in Javascript can cause issues with Server Side Rendering (SSR) and the Tailwind CSS breakpoints should be used when possible.
 */
export function useBreakpoints() {
  const mediaQueries = Object.fromEntries(
    Object.entries(screens).map(([breakpoint, value]) => [breakpoint, useMediaQuery(value)]),
  ) as Record<Screen, Ref<boolean>>

  // We make the breakpoints a computed object so that we can use them in templates as `breakpoints.x` instead of `breakpoints.x.value`
  const breakpoints = computed(
    () =>
      Object.fromEntries(
        Object.entries(mediaQueries).map(([breakpoint, queryRef]) => [breakpoint, unref(queryRef)]),
      ) as Record<Screen, boolean>,
  )

  return {
    /** The screen sizes defined in the preset */
    screens,
    /** Reactive media queries for each of the screen sizes */
    mediaQueries,
    /** The breakpoints as reactive media queries */
    breakpoints,
  }
}
