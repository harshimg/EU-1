"use client";z

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10 space-y-8">

        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            About Alpha Result
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            A focused platform for students who want clarity, not clutter.
          </p>
        </div>

        {/* INTRO */}
        <section className="space-y-3 text-slate-700 leading-relaxed">
          <p>
            Alpha Result is built with a simple goal — help university students
            prepare smarter using <strong>past year questions</strong> and
            <strong> clear solutions</strong>.
          </p>

          <p>
            Instead of scattered PDFs, screenshots, and guesswork,
            Alpha Result organizes questions by semester, subject, and paper
            so you can focus on understanding concepts, not searching for them.
          </p>
        </section>

        {/* WHAT MAKES IT DIFFERENT */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            What makes Alpha Result different?
          </h2>

          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <strong>Structured PYQs:</strong> Questions are organized
                exactly like university papers — main questions, sub-questions,
                marks, and patterns.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <strong>Readable solutions:</strong> Math and technical answers
                are written clearly with proper formatting instead of messy text.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <strong>Distraction-free UI:</strong> No ads, no popups,
                no unnecessary animations — just content.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <strong>Mobile-friendly:</strong> Study comfortably on your phone,
                tablet, or laptop.
              </span>
            </li>
          </ul>
        </section>

        {/* WHO IT IS FOR */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Who is it for?
          </h2>

          <p className="text-slate-700">
            Alpha Result is designed for undergraduate students who:
          </p>

          <ul className="list-disc list-inside text-slate-700 space-y-1">
            <li>Prepare from previous year question papers</li>
            <li>Want to understand question patterns</li>
            <li>Prefer clean explanations over memorization</li>
            <li>Study seriously close to exams</li>
          </ul>
        </section>

        {/* FUTURE */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            What’s coming next?
          </h2>

          <p className="text-slate-700">
            Alpha Result is actively evolving. Planned features include:
          </p>

          <ul className="list-disc list-inside text-slate-700 space-y-1">
            <li>Objective practice mode with results</li>
            <li>Performance tracking</li>
            <li>More subjects and universities</li>
            <li>Improved solution explanations</li>
          </ul>
        </section>

        {/* FOOTER NOTE */}
        <div className="pt-4 border-t text-sm text-slate-500">
          Built with care for students who want results, not noise.
        </div>

      </div>
    </div>
  );
}
