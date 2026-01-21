export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-neutral-800 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-neutral-600 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-neutral-300">Analyzing your photo...</p>
      <p className="text-neutral-500 text-sm">Finding the perfect vibe</p>
    </div>
  );
}
