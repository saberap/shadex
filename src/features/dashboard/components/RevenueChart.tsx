"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";

const data = [
  { month: "Jan", revenue: 3200, expenses: 1800 },
  { month: "Feb", revenue: 4800, expenses: 2200 },
  { month: "Mar", revenue: 4500, expenses: 2100 },
  { month: "Apr", revenue: 4700, expenses: 2400 },
  { month: "May", revenue: 5100, expenses: 2300 },
  { month: "Jun", revenue: 6000, expenses: 2800 },
  { month: "Jul", revenue: 5300, expenses: 2600 },
  { month: "Aug", revenue: 5700, expenses: 2500 },
  { month: "Sep", revenue: 4200, expenses: 2000 },
  { month: "Oct", revenue: 3100, expenses: 1900 },
  { month: "Nov", revenue: 4400, expenses: 2100 },
  { month: "Dec", revenue: 1600, expenses: 1200 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-5)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) =>
                `$${Number(value).toLocaleString()}`
              }
            />
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="var(--color-expenses)"
          strokeWidth={2}
          fill="url(#colorExpenses)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
