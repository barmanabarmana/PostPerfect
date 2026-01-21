import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--bg-body)' }}>
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          Privacy Policy
        </h1>

        <div className="space-y-6" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Information We Collect
            </h2>
            <p className="mb-4">
              When you use PostIT, we collect and process the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Photos you upload for caption generation</li>
              <li>Your preferences (vibes, language, hints)</li>
              <li>Usage data to improve our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              How We Use Your Information
            </h2>
            <p className="mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate captions and hashtags for your photos</li>
              <li>Improve our AI models and service quality</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Data Storage and Security
            </h2>
            <p className="mb-4">
              <strong>We do not store your photos in any database.</strong> Your uploaded images are only temporarily processed to generate captions and hashtags, then immediately discarded. We do not maintain any permanent copies of your photos.
            </p>
            <p className="mb-4">
              All data transmission is protected using industry-standard encryption to ensure your privacy and security during the processing phase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Third-Party Services
            </h2>
            <p className="mb-4">
              We use Claude AI by Anthropic to process your images and generate captions. When you use PostIT, your photos and preferences are shared with Anthropic's API for AI processing. This data is handled according to Anthropic's privacy policy and commercial terms of service.
            </p>
            <p className="mb-4">
              Important: While we do not store your data, Anthropic may process and temporarily retain your images as described in their privacy policy. We recommend reviewing{' '}
              <a
                href="https://www.anthropic.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70"
                style={{ color: 'var(--text-primary)' }}
              >
                Anthropic's Privacy Policy
              </a>{' '}
              for details on how they handle data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Your Rights
            </h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request deletion of your data</li>
              <li>Access the information we hold about you</li>
              <li>Opt-out of data collection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Contact Us
            </h2>
            <p>
              If you have questions about this privacy policy, please contact us at{' '}
              <a
                href="mailto:omelyanyuk.a@gmail.com"
                className="underline hover:opacity-70"
                style={{ color: 'var(--text-primary)' }}
              >
                omelyanyuk.a@gmail.com
              </a>
            </p>
          </section>

          <section className="text-sm pt-4">
            <p>Last updated: January 21, 2026</p>
          </section>
        </div>
      </div>
    </div>
  );
}
