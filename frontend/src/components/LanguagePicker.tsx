interface LanguagePickerProps {
  selectedLanguage: string | null;
  onLanguageSelect: (language: string | null) => void;
  disabled?: boolean;
}

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'es', label: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', label: 'French', flag: '🇫🇷' },
  { id: 'de', label: 'German', flag: '🇩🇪' },
  { id: 'it', label: 'Italian', flag: '🇮🇹' },
  { id: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { id: 'no', label: 'Norwegian', flag: '🇳🇴' },
  { id: 'ru', label: 'Russian', flag: '🇷🇺' },
  { id: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { id: 'ko', label: 'Korean', flag: '🇰🇷' },
  { id: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { id: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { id: 'hi', label: 'Hindi', flag: '🇮🇳' },
];

export function LanguagePicker({ selectedLanguage, onLanguageSelect, disabled }: LanguagePickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Choose quote language (optional)</p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((language) => (
          <button
            key={language.id}
            onClick={() => onLanguageSelect(selectedLanguage === language.id ? null : language.id)}
            disabled={disabled}
            className={`
              px-3 py-2 rounded text-sm font-medium transition-all hover:scale-105 active:scale-95
              ${selectedLanguage === language.id
                ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white'
                : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
            `}
            style={selectedLanguage !== language.id ? {
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border-color)'
            } : {}}
          >
            {language.flag} {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}
