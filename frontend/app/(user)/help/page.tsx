// import Link from "next/link";
// import { articles } from "@/lib/articles";

// export const metadata = {
//   title: "Articles - AlphaResult",
//   description:
//     "Guides and resources to help students prepare better using PYQs, SGPA tools, and exam strategies.",
// };

// export default function ArticlesPage() {
//   return (
//     <div className="max-w-3xl mx-auto px-4 py-10">
//       <h1 className="text-xl font-semibold mb-6">Student Guides</h1>

//       <div className="space-y-4">
//         {articles.map((a) => (
//           <Link
//             key={a.slug}
//             href={`/help/${a.slug}`}
//             className="block border p-4 rounded hover:bg-slate-50"
//           >
//             <h2 className="font-medium text-slate-800">{a.title}</h2>
//             <p className="text-sm text-slate-600 mt-1">
//               {a.description}
//             </p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }




import Link from "next/link";
import { articles } from "@/lib/articles";

export const metadata = {
  title: "Help & Guides - AlphaResult",
  description:
    "Explore helpful guides on using PYQs, SGPA calculator, and exam strategies to improve your academic performance.",
};

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* 🔥 HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Help & Student Guides
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          Find simple and practical guides to help you use AlphaResult effectively.
          Learn how to prepare using previous year question papers, plan your SGPA,
          and improve your exam strategy.
        </p>
      </div>

      {/* 🔥 FEATURED / IMPORTANT GUIDES */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Getting Started
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {articles.slice(0, 2).map((a) => (
            <Link
              key={a.slug}
              href={`/help/${a.slug}`}
              className="group border rounded-xl p-4 bg-white hover:bg-slate-50 transition"
            >
              <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                {a.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {a.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 🔥 ALL GUIDES */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          All Guides
        </h2>

        <div className="grid gap-4">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/help/${a.slug}`}
              className="group border rounded-xl p-4 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium text-slate-800 group-hover:text-indigo-600">
                  {a.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {a.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 🔥 BOTTOM CTA */}
      <div className="mt-12 border-t pt-6 text-sm text-slate-600">
        Looking to improve your preparation?
        <span className="ml-1">
          Start with{" "}
          <Link
            href="/help/how-to-use-alpharesult"
            className="text-indigo-600 underline"
          >
            how to use AlphaResult
          </Link>{" "}
          and explore other guides.
        </span>
      </div>
    </div>
  );
}