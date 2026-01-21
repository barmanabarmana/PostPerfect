interface VibePickerProps {
  selectedVibes: string[];
  onVibeSelect: (vibes: string[]) => void;
  disabled?: boolean;
}

const VIBES = [
  { id: 'chill', emoji: '😌', label: 'Chill' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic' },
  { id: 'romantic', emoji: '💕', label: 'Romantic' },
  { id: 'moody', emoji: '🌙', label: 'Moody' },
  { id: 'adventurous', emoji: '🌄', label: 'Adventurous' },
  { id: 'happy', emoji: '☀️', label: 'Happy' },
  { id: 'nostalgic', emoji: '🕰️', label: 'Nostalgic' },
  { id: 'dreamy', emoji: '✨', label: 'Dreamy' },
  { id: 'peaceful', emoji: '🕊️', label: 'Peaceful' },
  { id: 'mysterious', emoji: '🔮', label: 'Mysterious' },
  { id: 'confident', emoji: '💪', label: 'Confident' },
  { id: 'playful', emoji: '🎨', label: 'Playful' },
  { id: 'elegant', emoji: '👑', label: 'Elegant' },
  { id: 'wild', emoji: '🦁', label: 'Wild' },
  { id: 'cozy', emoji: '🧸', label: 'Cozy' },
  { id: 'inspiring', emoji: '🌟', label: 'Inspiring' },
  { id: 'philosophical', emoji: '🧠', label: 'Philosophical' },
  { id: 'humour', emoji: '😄', label: 'Humour' },
  { id: 'dark-humour', emoji: '💀', label: 'Dark Humour' },
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
      <p className="text-neutral-400 text-sm">Choose vibes (optional, can select multiple)</p>
      <div className="flex flex-wrap gap-2">
        {VIBES.map((vibe) => (
          <button
            key={vibe.id}
            onClick={() => handleVibeClick(vibe.id)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedVibes.includes(vibe.id)
                ? 'bg-neutral-700 text-white border border-neutral-600'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {vibe.emoji} {vibe.label}
          </button>
        ))}
      </div>
    </div>
  );
}
