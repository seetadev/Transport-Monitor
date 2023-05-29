import React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

export const BusdIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 400 400">
      <path d="m 200,55.5 36.5,36 -91.6,90.5 -36.5,-36 z m -91.4,198.7 36.5,36 146.4,-144.5 -36.5,-36 z M 163.5,308.4 200,344.5 346.4,200 309.9,164 Z M 126.7,200 90.2,164 53.7,200 90.2,236 Z" />
      <circle style={{ fill: "#282828" }} cx="200" cy="200" r="200" />
      <path
        style={{ fill: "#F0B90B" }}
        d="M200,55.5l36.5,36L144.9,182l-36.5-36ZM108.6,254.2l36.5,36L291.5,145.7l-36.5-36Zm54.9,54.2L200,344.5,346.4,200l-36.5-36ZM126.7,200,90.2,164,53.7,200l36.5,36Z"
      />
    </SvgIcon>
  );
};
