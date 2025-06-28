import React from "react";
import useChartColors from "../../utils/ChartColors";
import Chip from "@mui/material/Chip";
import ChartCard from "../common/ChartCard";
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";

// Helper for area gradient
function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

const YearlyEarningsChart = ({ data, change }) => {
  const theme = useTheme();

  const colorPalette = useChartColors();

  // Example data if not provided
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const earnings = data || [
    1200, 1500, 1800, 1600, 2000, 1750, 1900, 2100, 1700, 2200, 1950, 2300,
  ];

  return (
    <ChartCard
      title="Yearly Earnings Trend"
      value={`€${earnings.reduce((a, b) => a + b, 0).toLocaleString()}`}
      valueChip={
        typeof change === "number" ? (
          <Chip
            size="small"
            color={change >= 0 ? "success" : "error"}
            label={`${change >= 0 ? "+" : ""}${change}%`}
          />
        ) : null
      }
      caption="Earnings per month for the last 12 months"
    >
      <LineChart
        colors={colorPalette}
        xAxis={[
          {
            scaleType: "point",
            data: months,
            height: 24,
          },
        ]}
        yAxis={[{ width: 50 }]}
        series={[
          {
            id: "earnings",
            label: "Earnings",
            showMark: false,
            curve: "linear",
            area: true,
            data: earnings,
          },
        ]}
        height={250}
        margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
        grid={{ horizontal: true }}
        sx={{
          "& .MuiAreaElement-series-earnings": {
            fill: "url('#earnings-gradient')",
          },
        }}
        hideLegend
      >
        <AreaGradient
          color={theme.palette.primary.main}
          id="earnings-gradient"
        />
      </LineChart>
    </ChartCard>
  );
};

export default YearlyEarningsChart;
