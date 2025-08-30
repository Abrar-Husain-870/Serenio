declare module 'ogl' {
  export class Renderer {
    constructor(options?: any);
    gl: WebGL2RenderingContext & {
      ONE: number;
      ONE_MINUS_SRC_ALPHA: number;
      BLEND: number;
      blendFunc: (sfactor: number, dfactor: number) => void;
      enable: (cap: number) => void;
      clearColor: (r: number, g: number, b: number, a: number) => void;
      canvas: HTMLCanvasElement;
      getExtension: (name: string) => { loseContext: () => void } | null;
    };
    setSize(width: number, height: number): void;
  }
  export class Program {
    constructor(gl: any, options: any);
    uniforms: any;
  }
  export class Mesh {
    constructor(gl: any, options: any);
  }
  export class Color {
    constructor(hex: string);
    r: number;
    g: number;
    b: number;
  }
  export class Triangle {
    constructor(gl: any);
    attributes: any;
  }
}
