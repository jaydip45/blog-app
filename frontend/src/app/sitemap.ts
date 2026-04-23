import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://blog-app-alpha-snowy.vercel.app";

    const res = await fetch(
        "https://blog-app-production-a6bc.up.railway.app/api/posts"
    );

    const data = await res.json();

    const blogUrls = data.posts.map((post: any) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            priority: 1,
        },
        ...blogUrls,
    ];
}