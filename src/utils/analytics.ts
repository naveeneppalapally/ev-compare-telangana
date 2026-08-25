// Privacy-friendly analytics via Vercel Analytics. Events are no-ops in local dev.
import { track as vaTrack } from '@vercel/analytics';

export function trackEvent(name: string, props?: Record<string, string | number | boolean>): void {
  if (import.meta.env.DEV) return;
  try {
    vaTrack(name, props);
  } catch {
    // analytics must never break the app
  }
}

export default trackEvent;
