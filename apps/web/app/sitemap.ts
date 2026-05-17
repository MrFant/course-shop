import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = "https://www.ziiy.fun";

  const courses = await db.course.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const courseUrls = courses.map((course) => ({
    url: `${appUrl}/#${course.slug}`,
    lastModified: course.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${appUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...courseUrls,
  ];
}
