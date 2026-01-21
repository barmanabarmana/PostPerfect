import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    const initialTheme = (saved as Theme) || 'dark';

    // Apply theme class immediately on mount
    const root = document.documentElement;
    if (initialTheme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.backgroundColor = 'rgb(26, 26, 26)';
      document.body.style.backgroundColor = 'rgb(26, 26, 26)';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.backgroundColor = 'rgb(250, 250, 250)';
      document.body.style.backgroundColor = 'rgb(250, 250, 250)';
    }

    return initialTheme;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);

    // Apply theme class with explicit cleanup
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.backgroundColor = 'rgb(26, 26, 26)';
      document.body.style.backgroundColor = 'rgb(26, 26, 26)';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.backgroundColor = 'rgb(250, 250, 250)';
      document.body.style.backgroundColor = 'rgb(250, 250, 250)';
    }

    console.log('Theme changed to:', theme, 'classList:', root.classList.value);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
