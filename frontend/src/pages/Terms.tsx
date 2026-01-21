import { Link } from 'react-router-dom';

export function Terms() {
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
          Terms of Service
        </h1>

        <div className="space-y-6" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using PostIT, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Use of Service
            </h2>
            <p className="mb-4">
              PostIT provides AI-powered caption and hashtag generation for Instagram posts. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service only for lawful purposes</li>
              <li>Not upload inappropriate, offensive, or copyrighted content</li>
              <li>Not attempt to abuse or exploit the service</li>
              <li>Not use automated tools to access the service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Content Ownership
            </h2>
            <p className="mb-4">
              You retain all rights to the photos you upload. By using our service, you grant us a temporary license to process your photos for the purpose of generating captions and hashtags.
            </p>
            <p>
              The generated captions and hashtags are provided for your use, and you may use them freely for your Instagram posts or other purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Disclaimer of Warranties
            </h2>
            <p className="mb-4">
              PostIT is provided "as is" without any warranties, express or implied. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The service will be uninterrupted or error-free</li>
              <li>Generated content will always be accurate or appropriate</li>
              <li>The service will meet your specific requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Limitation of Liability
            </h2>
            <p>
              In no event shall PostIT be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              AI-Generated Content
            </h2>
            <p>
              Our service uses AI to generate captions and hashtags. While we strive for quality, AI-generated content may occasionally be inaccurate, inappropriate, or require editing. You are responsible for reviewing and approving all generated content before posting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Contact Information
            </h2>
            <p>
              For questions about these terms, please contact us at{' '}
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
