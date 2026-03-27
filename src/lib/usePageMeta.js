import { useEffect } from "react";

export function usePageMeta({
  title,
  description,
  image,
  canonicalPath = "/",
}) {
  useEffect(() => {
    const siteTitle = "A'Dash Technology";
    const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    document.title = pageTitle;

    const setMeta = (selector, attrName, attrValue, content) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = new URL(canonicalPath, window.location.origin).toString();

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", pageTitle);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description
    );
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta(
      'meta[property="og:url"]',
      "property",
      "og:url",
      new URL(canonicalPath, window.location.origin).toString()
    );
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", pageTitle);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description
    );

    if (image) {
      const absoluteImage = new URL(image, window.location.origin).toString();
      setMeta('meta[property="og:image"]', "property", "og:image", absoluteImage);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", absoluteImage);
    }
  }, [title, description, image, canonicalPath]);
}
