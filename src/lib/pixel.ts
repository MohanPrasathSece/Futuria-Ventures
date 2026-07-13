/**
 * Facebook/Meta Pixel tracking utility
 */

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

/**
 * Tracks a standard Facebook Pixel event
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      window.fbq("track", eventName, params);
      console.log(`[Meta Pixel] Tracked standard event: ${eventName}`, params || "");
    } catch (err) {
      console.error(`[Meta Pixel] Failed to track standard event: ${eventName}`, err);
    }
  }
};

/**
 * Tracks a custom Facebook Pixel event
 */
export const trackCustomEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      window.fbq("trackCustom", eventName, params);
      console.log(`[Meta Pixel] Tracked custom event: ${eventName}`, params || "");
    } catch (err) {
      console.error(`[Meta Pixel] Failed to track custom event: ${eventName}`, err);
    }
  }
};
