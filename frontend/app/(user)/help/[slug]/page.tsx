import { articles } from "@/lib/articles";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

/* 🔥 SEO METADATA (DYNAMIC) */
export function generateMetadata({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) return {};

  return {
    title: article.title + " - AlphaResult",
    description: article.description,
  };
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4 text-slate-800">
        {article.title}
      </h1>

      <p className="text-slate-600 text-sm mb-6">
        {article.description}
      </p>

      <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
        {article.content.split("\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}