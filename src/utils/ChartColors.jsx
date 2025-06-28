import { useTheme } from "@mui/material/styles";

export default function useChartColors() {
  const theme = useTheme();
  return [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];
}
// This hook returns the primary color palette for use in charts, ensuring consistent theming across components.
// It can be used in chart components to apply the same color scheme as the rest of the application.
