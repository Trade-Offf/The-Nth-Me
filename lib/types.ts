export interface Worldline {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface GenerationResult {
  originalImage: string;
  generatedImage: string;
  worldline: Worldline;
  timestamp: number;
}

