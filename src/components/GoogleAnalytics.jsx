import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GA_MEASUREMENT_ID, hasAnalytics, trackPageView } from "../lib/analytics";

function injectGoogleAnalytics() {
  if (
    typeof window === "undefined" ||
    !hasAnalytics() ||
    document.getElementById("google-analytics-script")
  ) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());

  const script = document.createElement("script");
  script.id = "google-analytics-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    injectGoogleAnalytics();
  }, []);

  useEffect(() => {
    if (!hasAnalytics()) return;
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [location]);

  return null;
}
