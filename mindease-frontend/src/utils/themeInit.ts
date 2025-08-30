// Initialize theme from localStorage before React renders
export const initializeTheme = () => {
  if (typeof window === 'undefined') return;
  
  const storedTheme = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Determine initial theme: localStorage > system preference > default (light)
  const shouldBeDark = storedTheme === null ? prefersDark : storedTheme === 'true';
  
  if (shouldBeDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Save the determined preference to localStorage if not already set
  if (storedTheme === null) {
    localStorage.setItem('darkMode', String(shouldBeDark));
  }
};
