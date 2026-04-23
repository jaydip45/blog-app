import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://blog-app-gamma-smoky.vercel.app/sitemap.xml",
    host: "https://blog-app-gamma-smoky.vercel.app",
  };
}