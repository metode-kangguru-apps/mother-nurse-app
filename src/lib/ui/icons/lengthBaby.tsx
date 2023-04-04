import * as React from "react";
import Svg, { Path, Circle, SvgProps } from "react-native-svg";
const LengthBaby = (props: SvgProps) => (
  <Svg
    width={22}
    height={29}
    viewBox="0 0 22 29"
    fill="none"
    {...props}
  >
    <Path
      d="M15.4887 14.7328V17.7832L18.1843 21.1711C18.6526 21.7496 19.3081 23.1998 18.1843 24.3731L15.9532 27.4512C15.4368 28.0365 14.1105 28.9386 12.9372 27.8643C11.7638 26.7901 12.1866 25.6126 12.5447 25.1581L14.1147 22.9271L11.3878 19.4978L8.55766 22.8031L10.2723 25.3441C10.4867 26.0047 10.6007 27.2133 9.7366 27.8643C8.70149 28.6442 7.57166 28.6926 6.63321 27.4512L4.28243 24.1842C3.95722 23.7816 3.46662 22.7199 4.10589 21.6941C4.74515 20.6683 6.42456 18.6594 7.18435 17.7832V14.7328C5.1568 14.0209 2.67776 12.0075 1.69168 11.0898C0.878657 10.35 1.27282 9.1284 1.79191 8.53145C2.33115 7.91132 3.24787 7.10246 5.35092 8.82804C7.45397 10.5536 9.90753 11.1737 11.5792 11.1737C13.2508 11.1737 15.2191 10.6615 17.1604 8.82804C19.1016 6.99461 20.3419 7.99221 20.8542 8.53145C21.3665 9.07069 21.5822 10.3649 20.3419 11.6321C19.3497 12.6459 16.693 14.1216 15.4887 14.7328Z"
      stroke="#4E9992"
      strokeLinejoin="round"
    />
    <Circle cx={11.295} cy={5.02012} r={3.67954} stroke="#4E9992" />
  </Svg>
);
export default LengthBaby;
