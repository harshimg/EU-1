// import { articles } from "@/lib/articles";
// import { notFound } from "next/navigation";

// type Props = {
//   params: { slug: string };
// };

// /* 🔥 SEO METADATA (DYNAMIC) */
// export function generateMetadata({ params }: Props) {
//   const article = articles.find((a) => a.slug === params.slug);

//   if (!article) return {};

//   return {
//     title: article.title + " - AlphaResult",
//     description: article.description,
//   };
// }

// export default function ArticlePage({ params }: Props) {
//   const article = articles.find((a) => a.slug === params.slug);

//   if (!article) return notFound();

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-10">
//       <h1 className="text-2xl font-semibold mb-4 text-slate-800">
//         {article.title}
//       </h1>

//       <p className="text-slate-600 text-sm mb-6">
//         {article.description}
//       </p>

//       <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
//         {article.content.split("\n").map((para, i) => (
//           <p key={i}>{para}</p>
//         ))}
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import { articles } from "@/lib/articles";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

/* 🔥 SEO METADATA */
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

  /* 🔥 pick related guides (exclude current) */
  const related = articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      
      {/* 🔥 BREADCRUMB */}
      <div className="text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link> {" / "}
        <Link href="/help" className="hover:underline">Help</Link>
      </div>

      {/* 🔥 TITLE */}
      <h1 className="text-2xl font-semibold text-slate-800 mb-3 leading-snug">
        {article.title}
      </h1>

      {/* 🔥 DESCRIPTION */}
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        {article.description}
      </p>

      {/* 🔥 CONTENT */}
      <div className="space-y-5 text-[15px] text-slate-700 leading-relaxed">
        {article.content.split("\n").map((para, i) =>
          para.trim() ? <p key={i}>{para}</p> : null
        )}
      </div>

      {/* 🔥 MID CTA */}
      <div className="mt-10 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
        Want to practice these concepts?
        <span className="ml-1">
          Go to{" "}
          <Link href="/pyq" className="underline font-medium">
            Previous Year Papers
          </Link>{" "}
          and start solving real questions.
        </span>
      </div>

      {/* 🔥 RELATED GUIDES */}
      <div className="mt-12">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Related Guides
        </h3>

        <div className="grid gap-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/help/${r.slug}`}
              className="border rounded-lg p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-medium text-slate-800">
                {r.title}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {r.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 🔥 BOTTOM CTA */}
      <div className="mt-12 border-t pt-6 text-sm text-slate-600">
        Explore more guides on{" "}
        <Link href="/help" className="text-indigo-600 underline">
          Help section
        </Link>{" "}
        to improve your exam preparation.
      </div>
    </div>
  );
}