import * as React from "react";
import ChartCard from "../common/ChartCard";
import useChartColors from "../../utils/ChartColors";
import Chip from "@mui/material/Chip";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

export default function MonthlyEarningsBarChart({ data, total, change }) {
  const theme = useTheme();
  const colorPalette = useChartColors();

  // Example fallback data if not provided
  const chartData = data || [1200, 1500, 900, 2000, 750];
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

  return (
    <ChartCard
      title="Your Earnings This Month"
      value={`€${(
        total ?? chartData.reduce((a, b) => a + b, 0)
      ).toLocaleString()}`}
      valueChip={
        typeof change === "number" ? (
          <Chip
            size="small"
            color={change >= 0 ? "success" : "error"}
            label={`${change >= 0 ? "+" : ""}${change}%`}
          />
        ) : null
      }
      caption="Earnings per week for the current month"
    >
      <BarChart
        borderRadius={8}
        colors={colorPalette}
        xAxis={[
          {
            scaleType: "band",
            categoryGapRatio: 0.5,
            data: weeks,
            height: 24,
          },
        ]}
        yAxis={[{ width: 50 }]}
        series={[
          {
            id: "earnings",
            label: "Earnings",
            data: chartData,
          },
        ]}
        height={250}
        margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
        grid={{ horizontal: true }}
        hideLegend
      />
    </ChartCard>
  );
}
