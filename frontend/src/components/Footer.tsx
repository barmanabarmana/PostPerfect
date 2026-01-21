import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 py-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link
            to="/privacy"
            className="transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            Terms
          </Link>
          <Link
            to="/faq"
            className="transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            FAQ
          </Link>
          <a
            href="mailto:omelyanyuk.a@gmail.com"
            className="transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
