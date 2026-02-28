export default function PrivacyPolicyPage() {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
  
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-slate-500">
          Last Updated: February {new Date().getFullYear()}
        </p>
  
        <section className="space-y-4">
          <p>
            Welcome to <strong>AlphaResult.in</strong>. Your privacy is important to us.
            This Privacy Policy explains how we collect, use, and protect your information
            when you use our website.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email address (for account creation and login)</li>
            <li>Semester and branch information</li>
            <li>Basic usage data through analytics tools</li>
            <li>Cookies for authentication and site functionality</li>
          </ul>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide access to PYQs and academic tools</li>
            <li>To personalize your semester and branch experience</li>
            <li>To improve website performance and user experience</li>
            <li>To display relevant advertisements (via Google AdSense)</li>
          </ul>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Cookies</h2>
          <p>
            AlphaResult uses cookies to maintain login sessions and enhance
            user experience. Third-party vendors, including Google,
            may use cookies to serve ads based on a user’s prior visits
            to this website or other websites.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting
            Google Ads Settings.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
          <p>
            We may use third-party services such as hosting providers,
            analytics services, and advertising partners.
            These services may collect limited data as required
            to perform their functions.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your
            personal information. However, no method of transmission
            over the Internet is 100% secure.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Children’s Information</h2>
          <p>
            AlphaResult does not knowingly collect personal information
            from children under 13 years of age.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">7. Your Consent</h2>
          <p>
            By using our website, you consent to our Privacy Policy
            and agree to its terms.
          </p>
        </section>
  
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">8. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy,
            please contact us at:
          </p>
          <p className="font-medium">
            alpharesult.in@gmail.com
          </p>
        </section>
  
      </div>
    );
  }