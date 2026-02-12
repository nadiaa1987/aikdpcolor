
export type ColoringStyle = 
  | 'Kids Cute'
  | 'Kawaii'
  | 'Mandala'
  | 'Animals'
  | 'Flowers'
  | 'Fantasy'
  | 'Simple'
  | 'Detailed';

export interface GenerationConfig {
  prompt: string;
  style: ColoringStyle;
  count: number;
  resolution: string;
  model: string;
}

export interface ColoringPage {
  id: string;
  url: string;
  prompt: string;
  style: ColoringStyle;
  model: string;
  createdAt: number;
  isBulk?: boolean;
  bulkGroupId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  plan: 'Free' | 'Pro';
  generationsRemaining: number;
  totalGenerated: number;
}
