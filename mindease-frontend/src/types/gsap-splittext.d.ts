declare module 'gsap/SplitText' {
  // Minimal TS shim to prevent build errors before installing GSAP SplitText
  export class SplitText {
    constructor(target: Element | string, vars?: any);
    chars?: Element[];
    words?: Element[];
    lines?: Element[];
    revert(): void;
  }
  export { SplitText as GSAPSplitText };
}
