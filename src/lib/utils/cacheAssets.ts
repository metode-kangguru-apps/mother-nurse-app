import { Asset } from "expo-asset";
import { Image } from "react-native";
import * as Font from "expo-font";

export function cacheImages(images: any[]) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export function cacheFonts(fonts: any[]) {
  return fonts.map((font) => Font.loadAsync(font));
}
