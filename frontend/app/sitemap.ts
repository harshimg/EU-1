// import { MetadataRoute } from 'next'

// export default function sitemap(): MetadataRoute.Sitemap {
//   const baseUrl = 'https://alpharesult.in'

//   const routes = [
//     '',
//     '/pyq',
//     '/pyq/download',
//     '/cgpa',
//     '/result',
//     '/about',
//     '/contact-us',
//   ]

//   return routes.map((route) => ({
//     url: `${baseUrl}${route}`,
//     lastModified: new Date(),
//   }))
// }


// import { SEMESTERS } from "@/lib/constants/academic";
// import { BRANCHES } from "@/lib/constants/academic";

// import { MetadataRoute } from "next";

// export default function sitemap(): MetadataRoute.Sitemap {
//   const baseUrl = "https://alpharesult.in";

//   const staticRoutes = [
//     {
//       url: `${baseUrl}`,
//       lastModified: new Date(),
//       changeFrequency: "daily" as const,
//       priority: 1,
//     },
//     {
//       url: `${baseUrl}/pyq`,
//       lastModified: new Date(),
//       changeFrequency: "daily" as const,
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/pyq/download`,
//       lastModified: new Date(),
//       changeFrequency: "daily" as const,
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/cgpa`,
//       lastModified: new Date(),
//       changeFrequency: "monthly" as const,
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/result`,
//       lastModified: new Date(),
//       changeFrequency: "daily" as const,
//       priority: 0.9,
//     },

//     // 🔥 IMPORTANT (for AdSense trust)
//     {
//       url: `${baseUrl}/about`,
//       lastModified: new Date(),
//       changeFrequency: "yearly" as const,
//       priority: 0.6,
//     },
//     {
//       url: `${baseUrl}/contact-us`,
//       lastModified: new Date(),
//       changeFrequency: "yearly" as const,
//       priority: 0.6,
//     },
//     {
//       url: `${baseUrl}/privacy-policy`,
//       lastModified: new Date(),
//       changeFrequency: "yearly" as const,
//       priority: 0.6,
//     },
//     {
//       url: `${baseUrl}/terms`,
//       lastModified: new Date(),
//       changeFrequency: "yearly" as const,
//       priority: 0.6,
//     },
//   ];

//   return staticRoutes;
// }


import { MetadataRoute } from "next";
import { SEMESTERS, BRANCHES } from "@/lib/constants/academic";
import { articles } from "@/lib/articles"; // 🔥 ADD THIS

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.alpharesult.in";

  /* ---------------- STATIC ---------------- */
  const staticRoutes = [
    "",
    "/pyq",
    "/pyq/download",
    "/result",
    "/help", // 🔥 ADD THIS
    "/about",
    "/contact-us",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));


    /* ---------------- HELP (DYNAMIC SLUG) ---------------- */
    const helpRoutes = articles.map((a) => ({
      url: `${baseUrl}/help/${a.slug}`,
      lastModified: new Date(),
    }));

  /* ---------------- DYNAMIC (FRONTEND) ---------------- */
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  for (const branch of BRANCHES) {
    for (const sem of SEMESTERS) {
      dynamicRoutes.push({
        url: `${baseUrl}/pyq/${branch.code}/sem-${sem.code}`,
        lastModified: new Date(),
      });

      dynamicRoutes.push({
        url: `${baseUrl}/pyq/download/${branch.code}/sem-${sem.code}`,
        lastModified: new Date(),
      });

      dynamicRoutes.push({
        url: `${baseUrl}/cgpa/${branch.code}/sem-${sem.code}`,
        lastModified: new Date(),
      });
    }
  }

  return [...staticRoutes,  ...helpRoutes, ...dynamicRoutes];
}