import Link from "next/link";
import { articles } from "@/lib/articles";

export const metadata = {
  title: "Articles - AlphaResult",
  description:
    "Guides and resources to help students prepare better using PYQs, SGPA tools, and exam strategies.",
};

export default function ArticlesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-6">Student Guides</h1>

      <div className="space-y-4">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/help/${a.slug}`}
            className="block border p-4 rounded hover:bg-slate-50"
          >
            <h2 className="font-medium text-slate-800">{a.title}</h2>
            <p className="text-sm text-slate-600 mt-1">
              {a.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}