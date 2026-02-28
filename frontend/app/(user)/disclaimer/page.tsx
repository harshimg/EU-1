export default function DisclaimerPage() {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
  
        <h1 className="text-3xl font-bold">Disclaimer</h1>
        <p className="text-sm text-slate-500">
          Last Updated:  {new Date().getFullYear()}
        </p>
  
        <section className="space-y-4">
          <p>
            The information provided on <strong>AlphaResult.in</strong> is for 
            educational and informational purposes only.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Non-Affiliation</h2>
          <p>
            AlphaResult is not affiliated with, endorsed by, or officially 
            connected to Bihar Engineering University (BEU) or any other university.
          </p>
          <p>
            All trademarks, logos, and university names belong to their respective owners.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Result Accuracy</h2>
          <p>
            While we strive to provide accurate and timely result information,
            we do not guarantee the correctness, completeness, or reliability
            of any result displayed on this website.
          </p>
          <p>
            Users are advised to verify official results from the university’s
            official website.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Educational Content</h2>
          <p>
            Previous Year Questions (PYQs), solutions, and study materials
            are shared for academic assistance only.
          </p>
          <p>
            If you believe any content violates copyright,
            please contact us for prompt removal.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. External Links</h2>
          <p>
            AlphaResult may contain links to external websites.
            We are not responsible for the content, policies,
            or practices of third-party websites.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Advertisement Disclaimer</h2>
          <p>
            This website may display third-party advertisements
            (including Google AdSense). These advertisements are
            served automatically and we do not directly control
            their content.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Contact</h2>
          <p>
            For copyright concerns or legal queries, contact:
          </p>
          <p className="font-medium">
            alpharesult.in@gmail.com
          </p>
        </section>
  
      </div>
    );
  }