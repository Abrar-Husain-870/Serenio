# ReactBits Components

This folder contains pre-built ReactBits components adapted for this project.

## Installation

Install required dependencies for SplitText (Shiny Text):

```
npm install gsap @gsap/react
```

TypeScript note: We include a temporary type declaration for `gsap/SplitText`. After installing, types should work. If not, the shim remains safe.

## Usage Example

```tsx
import SplitText from "../reactbits components/SplitText";

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

<SplitText
  text="Hello, GSAP!"
  className="text-2xl font-semibold text-center"
  delay={100}
  duration={0.6}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  onLetterAnimationComplete={handleAnimationComplete}
/>
```

## Files
- `SplitText.tsx`: Shiny Text component
