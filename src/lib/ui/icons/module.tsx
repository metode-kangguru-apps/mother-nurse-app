import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ModuleIcon = (props: SvgProps) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M5.45117 3.27295V21.2729H20.4512V3.27295H5.45117ZM4.70117 1.77295H21.2012C21.4001 1.77295 21.5909 1.85197 21.7315 1.99262C21.8722 2.13327 21.9512 2.32404 21.9512 2.52295V22.0229C21.9512 22.2219 21.8722 22.4126 21.7315 22.5533C21.5909 22.6939 21.4001 22.7729 21.2012 22.7729H4.70117C4.50226 22.7729 4.31149 22.6939 4.17084 22.5533C4.03019 22.4126 3.95117 22.2219 3.95117 22.0229V2.52295C3.95117 2.32404 4.03019 2.13327 4.17084 1.99262C4.31149 1.85197 4.50226 1.77295 4.70117 1.77295Z"
      fill={props.color || "#F48B88"}
    />
    <Path
      d="M16.7012 3.27295H18.2012V21.2729H16.7012V3.27295ZM3.20117 4.77295H6.20117C6.70117 4.77295 6.95117 5.02295 6.95117 5.52295C6.95117 6.02295 6.70117 6.27295 6.20117 6.27295H3.20117C2.70117 6.27295 2.45117 6.02295 2.45117 5.52295C2.45117 5.02295 2.70117 4.77295 3.20117 4.77295ZM3.20117 9.27295H6.20117C6.70117 9.27295 6.95117 9.52295 6.95117 10.0229C6.95117 10.5229 6.70117 10.7729 6.20117 10.7729H3.20117C2.70117 10.7729 2.45117 10.5229 2.45117 10.0229C2.45117 9.52295 2.70117 9.27295 3.20117 9.27295ZM3.20117 13.7729H6.20117C6.70117 13.7729 6.95117 14.0229 6.95117 14.5229C6.95117 15.0229 6.70117 15.2729 6.20117 15.2729H3.20117C2.70117 15.2729 2.45117 15.0229 2.45117 14.5229C2.45117 14.0229 2.70117 13.7729 3.20117 13.7729ZM3.20117 18.2729H6.20117C6.70117 18.2729 6.95117 18.5229 6.95117 19.0229C6.95117 19.5229 6.70117 19.7729 6.20117 19.7729H3.20117C2.70117 19.7729 2.45117 19.5229 2.45117 19.0229C2.45117 18.5229 2.70117 18.2729 3.20117 18.2729Z"
      fill={props.color || "#F48B88"}
    />
  </Svg>
);
export default ModuleIcon;
