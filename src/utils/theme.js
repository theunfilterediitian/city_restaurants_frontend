
export const themes = [
  {
    name: 'Teal',
    colors: {
      '--primary-50': '#f0fdfa',
      '--primary-100': '#ccfbf1',
      '--primary-200': '#99f6e4',
      '--primary-300': '#5eead4',
      '--primary-400': '#2dd4bf',
      '--primary-500': '#14b8a6',
      '--primary-600': '#0d9488',
      '--primary-700': '#0f766e',
      '--primary-800': '#115e59',
      '--primary-900': '#134e4a',
      '--primary-shadow': 'rgba(13, 148, 136, 0.2)',
    }
  },
  {
    name: 'Indigo',
    colors: {
      '--primary-50': '#eef2ff',
      '--primary-100': '#e0e7ff',
      '--primary-200': '#c7d2fe',
      '--primary-300': '#a5b4fc',
      '--primary-400': '#818cf8',
      '--primary-500': '#6366f1',
      '--primary-600': '#4f46e5',
      '--primary-700': '#4338ca',
      '--primary-800': '#3730a3',
      '--primary-900': '#1e1b4b',
      '--primary-shadow': 'rgba(79, 70, 229, 0.2)',
    }
  },
  {
    name: 'Rose',
    colors: {
      '--primary-50': '#fff1f2',
      '--primary-100': '#ffe4e6',
      '--primary-200': '#fecdd3',
      '--primary-300': '#fda4af',
      '--primary-400': '#fb7185',
      '--primary-500': '#f43f5e',
      '--primary-600': '#e11d48',
      '--primary-700': '#be123c',
      '--primary-800': '#9f1239',
      '--primary-900': '#881337',
      '--primary-shadow': 'rgba(225, 29, 72, 0.2)',
    }
  },
  {
    name: 'Amber',
    colors: {
      '--primary-50': '#fffbeb',
      '--primary-100': '#fef3c7',
      '--primary-200': '#fde68a',
      '--primary-300': '#fcd34d',
      '--primary-400': '#fbbf24',
      '--primary-500': '#f59e0b',
      '--primary-600': '#d97706',
      '--primary-700': '#b45309',
      '--primary-800': '#92400e',
      '--primary-900': '#78350f',
      '--primary-shadow': 'rgba(217, 119, 6, 0.2)',
    }
  }
];

export const applyRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    const theme = themes[randomIndex];
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([variable, value]) => {
        root.style.setProperty(variable, value);
    });
    
    console.log(`Applied theme: ${theme.name}`);
    return theme;
};
