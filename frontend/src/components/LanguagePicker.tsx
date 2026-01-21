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
      <p className="text-neutral-400 text-sm">Choose quote language (optional)</p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((language) => (
          <button
            key={language.id}
            onClick={() => onLanguageSelect(selectedLanguage === language.id ? null : language.id)}
            disabled={disabled}
            className={`
              px-3 py-2 rounded-full text-sm font-medium transition-all
              ${selectedLanguage === language.id
                ? 'bg-neutral-700 text-white border border-neutral-600'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {language.flag} {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}
