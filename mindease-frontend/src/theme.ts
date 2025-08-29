// Custom Chakra v3 system extension built on defaultSystem
// Tailwind remains for now; we will gradually switch components to Chakra props.
import { defaultSystem } from '@chakra-ui/react'

// Build a system object by extending defaultSystem with our tokens.
const system: any = {
  ...defaultSystem,
  theme: {
    ...((defaultSystem as any).theme || {}),
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
    tokens: {
      ...(((defaultSystem as any).theme?.tokens) || {}),
      colors: {
        ...(((defaultSystem as any).theme?.tokens?.colors) || {}),
        brand: {
          100: '#FADADD', // Soft Pink
          200: '#E6E6FA', // Pastel Lavender
          300: '#F5F5DC', // Muted Beige
          400: '#FFFFFF', // White
        },
        accent: {
          400: '#8CC9CB', // Slightly deeper teal for dark-mode contrast
          500: '#A8DADC', // Calming Teal
          600: '#BDE0FE', // Soft Sky Blue
        },
      },
      fonts: {
        ...(((defaultSystem as any).theme?.tokens?.fonts) || {}),
        heading: "'Quicksand', sans-serif",
        body: "'Nunito', sans-serif",
      },
      fontSizes: {
        ...(((defaultSystem as any).theme?.tokens?.fontSizes) || {}),
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '24px',
        '2xl': '32px',
      },
      radii: {
        ...(((defaultSystem as any).theme?.tokens?.radii) || {}),
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      shadows: {
        ...(((defaultSystem as any).theme?.tokens?.shadows) || {}),
        softSm: '0 1px 3px rgba(0,0,0,0.08)',
        softMd: '0 4px 6px rgba(0,0,0,0.1)',
        softLg: '0 10px 20px rgba(0,0,0,0.12)',
      },
      transition: {
        ...(((defaultSystem as any).theme?.tokens?.transition) || {}),
        duration: {
          slow: '400ms',
        },
        easing: {
          soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
  },
}

export { system }
export default system
