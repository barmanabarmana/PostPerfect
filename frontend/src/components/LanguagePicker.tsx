interface LanguagePickerProps {
  selectedLanguage: string | null;
  onLanguageSelect: (language: string | null) => void;
  disabled?: boolean;
}

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇬🇧', grayscale: false },
  { id: 'es', label: 'Spanish', flag: '🇪🇸', grayscale: false },
  { id: 'fr', label: 'French', flag: '🇫🇷', grayscale: false },
  { id: 'de', label: 'German', flag: '🇩🇪', grayscale: false },
  { id: 'it', label: 'Italian', flag: '🇮🇹', grayscale: false },
  { id: 'pt', label: 'Portuguese', flag: '🇵🇹', grayscale: false },
  { id: 'no', label: 'Norwegian', flag: '🇳🇴', grayscale: false },
  { id: 'ua', label: 'Ukrainian', flag: '🇺🇦', grayscale: false },
  { id: 'ru', label: 'Russian', flag: '🏳️', grayscale: false },
  { id: 'ja', label: 'Japanese', flag: '🇯🇵', grayscale: false },
  { id: 'ko', label: 'Korean', flag: '🇰🇷', grayscale: false },
  { id: 'zh', label: 'Chinese', flag: '🇨🇳', grayscale: false },
  { id: 'ar', label: 'Arabic', flag: '🇸🇦', grayscale: false },
  { id: 'hi', label: 'Hindi', flag: '🇮🇳', grayscale: false },
];

export function LanguagePicker({ selectedLanguage, onLanguageSelect, disabled }: LanguagePickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Choose caption language (optional)</p>
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
            <span className={language.grayscale ? 'grayscale' : ''}>{language.flag}</span> {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}
