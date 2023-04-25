import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export enum Font {
  Light = "WorkSans-Light",
  LightItalic = "WorkSans-LightItalic",
  ExtraLight = "WorkSans-ExtraLight",
  ExtraLightItalic = "WorkSans-ExtraLightItalic",
  Thin = "Lato-Thin",
  ThinItalic = "Lato-ThinItalic",
  Medium = "WorkSans-Medium",
  MediumItalic = "WorkSans-MediumItalic",
  Regular = "WorkSans-Regular",
  Italic = "WorkSans-Italic",
  ExtraBold = "WorkSans-ExtraBold",
  ExtraBoldItalic = "WorkSans-ExtraBoldItalic",
  Bold = "WorkSans-Bold",
  BoldItalic = "WorkSans-BoldItalic",
  Black = "WorkSans-Black",
  BlackItalic = "WorkSans-BlackItalic",
}

export const customFont = [
  AntDesign.font,
  EvilIcons.font,
  Ionicons.font,
  FontAwesome.font,
  {"WorkSans-Black": require("../../../assets/fonts/WorkSans-Black.ttf")},
  {"WorkSans-BlackItalic": require("../../../assets/fonts/WorkSans-BlackItalic.ttf")},
  {"WorkSans-Bold": require("../../../assets/fonts/WorkSans-Bold.ttf")},
  {"WorkSans-BoldItalic": require("../../../assets/fonts/WorkSans-BoldItalic.ttf")},
  {"WorkSans-ExtraBold": require("../../../assets/fonts/WorkSans-ExtraBold.ttf")},
  {"WorkSans-ExtraBoldItalic": require("../../../assets/fonts/WorkSans-ExtraBoldItalic.ttf")},
  {"WorkSans-Italic": require("../../../assets/fonts/WorkSans-Italic.ttf")},
  {"WorkSans-Light": require("../../../assets/fonts/WorkSans-Light.ttf")},
  {"WorkSans-LightItalic": require("../../../assets/fonts/WorkSans-LightItalic.ttf")},
  {"WorkSans-ExtraLight": require("../../../assets/fonts/WorkSans-ExtraLight.ttf")},
  {"WorkSans-ExtraLightItalic": require("../../../assets/fonts/WorkSans-ExtraLightItalic.ttf")},
  {"WorkSans-Medium": require("../../../assets/fonts/WorkSans-Medium.ttf")},
  {"WorkSans-MediumItalic": require("../../../assets/fonts/WorkSans-MediumItalic.ttf")},
  {"WorkSans-Regular": require("../../../assets/fonts/WorkSans-Regular.ttf")},
  {"WorkSans-SemiBold": require("../../../assets/fonts/WorkSans-SemiBold.ttf")},
  {"WorkSans-SemiBoldItalic": require("../../../assets/fonts/WorkSans-SemiBoldItalic.ttf")},
]
;
