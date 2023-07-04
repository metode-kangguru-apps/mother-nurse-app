import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const FamilyIcon = (props: SvgProps) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    {...props}
  >
    <Path
      d="M16 4C15.45 4 14.979 3.804 14.587 3.412C14.195 3.02 13.9993 2.54934 14 2C14 1.45 14.196 0.979002 14.588 0.587002C14.98 0.195002 15.4507 -0.000664969 16 1.69779e-06C16.55 1.69779e-06 17.021 0.196002 17.413 0.588002C17.805 0.980002 18.0007 1.45067 18 2C18 2.55 17.804 3.021 17.412 3.413C17.02 3.805 16.5493 4.00067 16 4ZM15 20V12C15 11.3333 14.829 10.7333 14.487 10.2C14.145 9.66667 13.7077 9.25 13.175 8.95L14.05 6.375C14.1833 5.95834 14.4293 5.625 14.788 5.375C15.1467 5.125 15.5507 5 16 5C16.45 5 16.8543 5.125 17.213 5.375C17.5717 5.625 17.8173 5.95834 17.95 6.375L20.5 14H18V20H15ZM10.5 9.5C10.0833 9.5 9.729 9.354 9.437 9.062C9.145 8.77 8.99933 8.416 9 8C9 7.58334 9.146 7.229 9.438 6.937C9.73 6.645 10.084 6.49934 10.5 6.5C10.9167 6.5 11.271 6.646 11.563 6.938C11.855 7.23 12.0007 7.584 12 8C12 8.41667 11.854 8.771 11.562 9.063C11.27 9.355 10.916 9.50067 10.5 9.5ZM3.5 4C2.95 4 2.479 3.804 2.087 3.412C1.695 3.02 1.49933 2.54934 1.5 2C1.5 1.45 1.696 0.979002 2.088 0.587002C2.48 0.195002 2.95067 -0.000664969 3.5 1.69779e-06C4.05 1.69779e-06 4.521 0.196002 4.913 0.588002C5.305 0.980002 5.50067 1.45067 5.5 2C5.5 2.55 5.304 3.021 4.912 3.413C4.52 3.805 4.04933 4.00067 3.5 4ZM1.5 20V13H0V7C0 6.45 0.196 5.979 0.588 5.587C0.98 5.195 1.45067 4.99934 2 5H5C5.55 5 6.021 5.196 6.413 5.588C6.805 5.98 7.00067 6.45067 7 7V13H5.5V20H1.5ZM9 20V16H8V12C8 11.5833 8.146 11.229 8.438 10.937C8.73 10.645 9.084 10.4993 9.5 10.5H11.5C11.9167 10.5 12.271 10.646 12.563 10.938C12.855 11.23 13.0007 11.584 13 12V16H12V20H9Z"
      fill="#4E9992"
    />
  </Svg>
);
export default FamilyIcon;