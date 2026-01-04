declare module 'gif.js' {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
  }

  interface GIFFrame {
    copy?: boolean;
    delay?: number;
  }

  class GIF {
    constructor(options: GIFOptions);
    addFrame(element: HTMLCanvasElement | CanvasRenderingContext2D, options?: GIFFrame): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    render(): void;
  }

  export default GIF;
}

