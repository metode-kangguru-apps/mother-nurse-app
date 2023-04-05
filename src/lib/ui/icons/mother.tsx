import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const MotherIcons = (props: SvgProps) => (
  <Svg
    width={26}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      d="M12.998 0c2.49 0 4.5 2.01 4.5 4.5s-2.01 4.5-4.5 4.5-4.5-2.01-4.5-4.5 2.01-4.5 4.5-4.5Zm12 24-3-8.16c-.525-1.485-.99-2.775-3-3.84-2.055-1.05-3.555-1.5-6-1.5-2.415 0-3.915.45-6 1.5-1.98 1.065-2.445 2.355-3 3.84l-3 8.16c-.345 1.695 3.57 3.66 6.195 4.785A14.379 14.379 0 0 0 12.998 30c2.07 0 4.005-.42 5.835-1.215 2.625-1.125 6.54-3.09 6.165-4.785Zm-6.87-.75-5.13 5.25-5.13-5.25a3.152 3.152 0 0 1-.87-2.175c0-1.695 1.35-3.075 3-3.075.825 0 1.59.345 2.13.915l.87.885.87-.9a2.98 2.98 0 0 1 2.13-.9c1.665 0 3 1.38 3 3.075 0 .84-.33 1.62-.87 2.175Z"
      fill="#fff"
    />
  </Svg>
);

export default MotherIcons;
