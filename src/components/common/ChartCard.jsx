import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function ChartCard({
  title,
  value,
  valueChip,
  caption,
  children,
}) {
  return (
    <Card variant="outlined" sx={{ width: "100%", height: 370 }}>
      <CardContent
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {value}
            </Typography>
            {valueChip}
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {caption}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}
