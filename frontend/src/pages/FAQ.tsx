import { Link } from 'react-router-dom';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:opacity-80 transition-opacity"
      >
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {question}
        </h3>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="var(--text-primary)"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4" style={{ color: 'var(--text-secondary)' }}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  const faqs = [
    {
      question: "What is PostIT?",
      answer: "PostIT is an AI-powered tool that analyzes your photos and generates engaging Instagram captions, mood tags, and relevant hashtags to help make your posts stand out."
    },
    {
      question: "How does it work?",
      answer: "Simply upload a photo, optionally select vibes, language preferences, and hints. Our AI analyzes your image and generates a complete Instagram post with captions and hashtags tailored to your content."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. Your photos are processed securely and are not stored permanently on our servers. We use encryption to protect your data during transmission."
    },
    {
      question: "What languages are supported?",
      answer: "PostIT supports multiple languages including English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, and Chinese."
    },
    {
      question: "Can I customize the generated content?",
      answer: "Absolutely! You can select different vibes (moods), choose your preferred language, and provide hints to guide the AI. You can also regenerate content if you want different results."
    },
    {
      question: "Is PostIT free to use?",
      answer: "Yes, PostIT is currently free to use. We may introduce premium features in the future, but the core functionality will remain available."
    },
    {
      question: "What types of photos work best?",
      answer: "PostIT works with any type of photo! Whether it's food, travel, fashion, nature, or selfies, our AI can analyze the content and generate appropriate captions and hashtags."
    },
    {
      question: "Can I edit the generated captions?",
      answer: "Yes, you can copy the generated content and edit it however you like before posting to Instagram. We recommend reviewing and personalizing the content to match your voice."
    },
    {
      question: "How many hashtags are generated?",
      answer: "We typically generate 5-15 relevant hashtags based on your photo content and selected vibes. You can choose which ones to use."
    },
    {
      question: "What if I don't like the generated content?",
      answer: "You can use the regenerate button to get different suggestions. Each generation will provide fresh captions and hashtags based on your photo and preferences."
    }
  ];

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

        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Frequently Asked Questions
        </h1>

        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Find answers to common questions about PostIT
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: 'var(--bg-surface)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Still have questions?
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Feel free to reach out to us at{' '}
            <a
              href="mailto:omelyanyuk.a@gmail.com"
              className="underline hover:opacity-70"
              style={{ color: 'var(--text-primary)' }}
            >
              omelyanyuk.a@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
