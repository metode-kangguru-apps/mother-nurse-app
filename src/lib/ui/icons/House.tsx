import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const HouseIcon = (props: SvgProps) => (
  <Svg width={20} height={17} viewBox="0 0 20 17" fill="none" {...props}>
    <Path d="M8 17V11H12V17H17V9H20L10 0L0 9H3V17H8Z" fill="#4E9992" />
  </Svg>
);
export default HouseIcon;
