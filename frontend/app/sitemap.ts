import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alpharesult.in'

  const routes = [
    '',
    '/pyq',
    '/pyq/download',
    '/cgpa',
    '/result',
    '/about',
    '/contact-us',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}