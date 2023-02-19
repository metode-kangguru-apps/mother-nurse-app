import { rem } from "./unit";

// Text sizes
export enum TextSize {
  h1 = 96,
  h2 = 60,
  h3 = 48,
  h4 = 34,
  h5 = 24,
  h6 = 20,
  title = 16,
  body = 14,
  caption = 12,
  overline = 10,
  tiny = 9,
  extratiny = 8,
}

export interface RelativeTextSizeType {
  h1: string | number;
  h2: string | number;
  h3: string | number;
  h4: string | number;
  h5: string | number;
  h6: string | number;
  title: string | number;
  body: string | number;
  caption: string | number;
  overline: string | number;
  tiny: string | number;
  extratiny: string | number;
}

// Use https://nekocalc.com/px-to-rem-converter
// Select root font as 14
export const RelativeTextSize: RelativeTextSizeType = {
  h1: rem(6.857),
  h2: rem(4.286),
  h3: rem(3.429),
  h4: rem(2.429),
  h5: rem(1.714),
  h6: rem(1.429),
  title: rem(1.143),
  body: rem(1),
  caption: rem(0.857),
  overline: rem(0.714),
  tiny: rem(0.643),
  extratiny: rem(0.6),
};
