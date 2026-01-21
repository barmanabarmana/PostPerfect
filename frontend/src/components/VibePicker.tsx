interface VibePickerProps {
  selectedVibes: string[];
  onVibeSelect: (vibes: string[]) => void;
  disabled?: boolean;
}

const VIBES = [
  { id: 'philosophical', emoji: '🧠', label: 'Philosophical' },
  { id: 'sad', emoji: '😔', label: 'Sad' },
  { id: 'happy', emoji: '☀️', label: 'Happy' },
  { id: 'nostalgic', emoji: '🕰️', label: 'Nostalgic' },
  { id: 'romantic', emoji: '💕', label: 'Romantic' },
  { id: 'chill', emoji: '😌', label: 'Chill' },
];

export function VibePicker({ selectedVibes, onVibeSelect, disabled }: VibePickerProps) {
  const handleVibeClick = (vibeId: string) => {
    if (selectedVibes.includes(vibeId)) {
      onVibeSelect(selectedVibes.filter(id => id !== vibeId));
    } else {
      onVibeSelect([...selectedVibes, vibeId]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Choose vibes (optional, can select multiple)</p>
      <div className="flex flex-wrap gap-2">
        {VIBES.map((vibe) => (
          <button
            key={vibe.id}
            onClick={() => handleVibeClick(vibe.id)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded text-sm font-medium transition-all hover:scale-105 active:scale-95
              ${selectedVibes.includes(vibe.id)
                ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white'
                : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
            `}
            style={!selectedVibes.includes(vibe.id) ? {
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border-color)'
            } : {}}
          >
            {vibe.emoji} {vibe.label}
          </button>
        ))}
      </div>
    </div>
  );
}
