import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://blog-app-alpha-snowy.vercel.app/sitemap.xml",
    host: "https://blog-app-alpha-snowy.vercel.app",
  };
}