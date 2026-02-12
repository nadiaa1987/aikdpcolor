
import React from 'react';
import { 
  Baby, 
  Cat, 
  Flower, 
  Sparkles, 
  CircleDot, 
  LayoutGrid, 
  Gamepad2, 
  Feather 
} from 'lucide-react';
import { ColoringStyle } from './types';

export const STYLE_TEMPLATES: Record<ColoringStyle, { description: string; prompt: string; icon: React.ReactNode }> = {
  'Kids Cute': {
    description: 'Simple, happy characters with bold lines perfect for young children.',
    prompt: 'ultra-clean coloring book page, cute happy character for kids, bold thick black outlines, minimal details, cartoon style, high contrast, pure white background, no shading, no grayscale.',
    icon: <Baby className="w-5 h-5" />
  },
  'Kawaii': {
    description: 'Japanese-inspired cute aesthetic with minimalist, rounded features.',
    prompt: 'kawaii style coloring book page, tiny cute characters, big eyes, simple rounded shapes, thick bold black lines, minimalist background, white space, high contrast, black and white line art.',
    icon: <Gamepad2 className="w-5 h-5" />
  },
  'Mandala': {
    description: 'Intricate geometric and symmetrical patterns for therapeutic coloring.',
    prompt: 'intricate circular mandala pattern, symmetrical geometric designs, repeating floral motifs, fine black line art, professional coloring page, white background, no shading, balanced composition.',
    icon: <CircleDot className="w-5 h-5" />
  },
  'Animals': {
    description: 'Realistic or stylized animal illustrations with defined fur/feather patterns.',
    prompt: 'animal coloring page, professional illustration, clear black line art, fur and texture patterns defined by lines only, high detail, no gradients, white background, thick outlines, nature themed.',
    icon: <Cat className="w-5 h-5" />
  },
  'Flowers': {
    description: 'Botanical drawings and floral arrangements with varying complexity.',
    prompt: 'botanical coloring page, beautiful flowers and leaves, elegant line work, black and white ink drawing style, high resolution line art, white background, crisp edges, no shading.',
    icon: <Flower className="w-5 h-5" />
  },
  'Fantasy': {
    description: 'Dragons, fairies, and magical landscapes with imaginative details.',
    prompt: 'fantasy coloring book page, mythical creatures, magical landscape, ethereal line art, detailed ink illustration, black and white, thick outlines for main subjects, no gray tones, high contrast.',
    icon: <Sparkles className="w-5 h-5" />
  },
  'Simple': {
    description: 'Very thick lines and large coloring areas, ideal for toddlers.',
    prompt: 'toddler coloring page, extremely simple shapes, ultra-thick black outlines, very large areas for coloring, no small details, minimalist art, pure white background, bold line art.',
    icon: <LayoutGrid className="w-5 h-5" />
  },
  'Detailed': {
    description: 'Advanced patterns and complex scenes for adult coloring books.',
    prompt: 'complex adult coloring book page, intricate details, highly detailed line art, professional ink illustration, fine lines mixed with bold outlines, sophisticated composition, white background, no shading.',
    icon: <Feather className="w-5 h-5" />
  }
};

export const KDP_PROMPT_MODIFIERS = "black and white line art, pure white background, high contrast, no shading, no grayscale, no dither, 300 DPI print quality, professional coloring book illustration, bold edges, clean lines.";
