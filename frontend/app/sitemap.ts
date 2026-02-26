import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
        url: 'https://alpharesult.in',
        lastModified: new Date(),
      },
    { url: 'https://alpharesult.in/pyq/download' },
    { url: 'https://alpharesult.in/pyq' },
    { url: 'https://alpharesult.in/cgpa' },
    { url: 'https://alpharesult.in/result' },
    { url: 'https://alpharesult.in/about' },
    { url: 'https://alpharesult.in/contact-us' },
  ]
}