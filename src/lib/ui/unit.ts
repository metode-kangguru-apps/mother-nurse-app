import { Platform } from "react-native";

export const BASE_FONT = 14;
export const DEFAULT_MAX_FONT_SIZE_MULTIPLIER = 1.25;

export function rem(value: number): number | string {
  if (Platform.OS === "web") return `${value}rem`;
  return BASE_FONT * value;
}

export function em(value: number): number | string {
  if (Platform.OS === "web") return `${value}em`;
  return rem(value);
}

export enum Dimension {
  none = 0,
  tiny = 8,
  small = 16,
  base = 24,
  large = 48,
  xlarge = 64,
  xxlarge = 80,
  xxxlarge = 96,
}
