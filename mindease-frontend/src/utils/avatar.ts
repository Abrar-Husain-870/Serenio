export type AvatarStyle = {
  bgLight: string;
  colorLight: string;
  borderColorLight: string;
  bgDark: string;
  colorDark: string;
  borderColorDark: string;
};

const LIGHT_BG = ['accent.600', 'blue.500', 'teal.500', 'purple.500', 'pink.500', 'orange.500', 'cyan.500'];
const DARK_BG = ['accent.400', 'blue.300', 'teal.300', 'purple.300', 'pink.300', 'orange.300', 'cyan.300'];

function getStoredIndex(key: string): number | null {
  try {
    const v = localStorage.getItem(`avatarColor:${key}`);
    return v ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
}

function setStoredIndex(key: string, idx: number) {
  try {
    localStorage.setItem(`avatarColor:${key}`, String(idx));
  } catch {
    // ignore
  }
}

export function getRandomAvatarStyle(key: string = 'default'): AvatarStyle {
  const paletteSize = LIGHT_BG.length;
  let idx = getStoredIndex(key);
  if (idx === null || Number.isNaN(idx)) {
    idx = Math.floor(Math.random() * paletteSize);
    setStoredIndex(key, idx);
  }
  const bgLight = LIGHT_BG[idx % paletteSize];
  const bgDark = DARK_BG[idx % paletteSize];
  // pick contrasting text colors
  const colorLight = 'white';
  const colorDark = 'gray.900';
  const borderColorLight = 'white';
  const borderColorDark = 'gray.700';
  return { bgLight, colorLight, borderColorLight, bgDark, colorDark, borderColorDark };
}
