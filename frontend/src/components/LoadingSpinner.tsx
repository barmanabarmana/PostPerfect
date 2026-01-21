export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: 'var(--border-color)' }} />
        <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'var(--ui-link-blue)' }} />
      </div>
      <p className="mt-4" style={{ color: 'var(--text-primary)' }}>Analyzing your photo...</p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Finding the perfect vibe</p>
    </div>
  );
}
