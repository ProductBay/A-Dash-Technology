export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function hasAnalytics() {
  return Boolean(GA_MEASUREMENT_ID);
}

export function trackPageView(path, title = document.title) {
  if (!hasAnalytics() || typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
}
