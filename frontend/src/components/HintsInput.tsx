import { useState, type KeyboardEvent } from 'react';

interface HintsInputProps {
  hints: string[];
  onHintsChange: (hints: string[]) => void;
  onSubmit?: () => void;
  disabled?: boolean;
}

export function HintsInput({ hints, onHintsChange, onSubmit, disabled }: HintsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addHint = (hint: string) => {
    const trimmedHint = hint.trim();
    if (trimmedHint && trimmedHint.length <= 20 && !hints.includes(trimmedHint)) {
      onHintsChange([...hints, trimmedHint]);
      setInputValue('');
    }
  };

  const removeHint = (hintToRemove: string) => {
    onHintsChange(hints.filter(h => h !== hintToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addHint(inputValue);
    } else if (e.key === ' ' && inputValue.trim()) {
      e.preventDefault();
      addHint(inputValue);
    } else if (e.key === ',' && inputValue.trim()) {
      e.preventDefault();
      addHint(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && hints.length > 0) {
      e.preventDefault();
      removeHint(hints[hints.length - 1]);
    }
  };

  const handleInputChange = (value: string) => {
    // Remove spaces - only allow single words
    const cleanValue = value.replace(/\s/g, '');

    // If user types comma, add the hint
    if (value.includes(',')) {
      const hintToAdd = cleanValue.replace(',', '').trim();
      if (hintToAdd) {
        addHint(hintToAdd);
      }
      setInputValue('');
    } else if (cleanValue.length <= 20) {
      setInputValue(cleanValue);
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addHint(inputValue);
    }
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm block" style={{ color: 'var(--text-secondary)' }}>
        Add context hints (optional)
      </label>

      <div className="relative">
        {/* Tags Container */}
        <div className="w-full min-h-[48px] px-4 py-2 rounded-lg flex flex-wrap gap-2 items-center" style={{ backgroundColor: 'var(--bg-surface)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          {hints.map((hint) => (
            <span
              key={hint}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-full text-sm"
            >
              {hint}
              <button
                type="button"
                onClick={() => removeHint(hint)}
                disabled={disabled}
                className="hover:text-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Remove ${hint}`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}

          {/* Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hints.length === 0 ? "Type single words and press space..." : ""}
            disabled={disabled}
            className="flex-1 min-w-[200px] bg-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Submit Button */}
        {onSubmit && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-color)' }}
            aria-label="Apply hints"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
        Press space to add single-word hints. Max 20 characters per hint. Examples: divorce, graduation, sunset
      </p>
    </div>
  );
}
