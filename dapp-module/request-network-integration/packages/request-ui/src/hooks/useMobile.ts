import { useMediaQuery, useTheme } from "@material-ui/core";

/**
 * Returns true on mobile (based on screen-width)
 */
export const useMobile = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  return !matches;
};
