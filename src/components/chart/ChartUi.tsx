"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { IchartData } from "@/utils/TypesTs";

// const chartData = [
//   { budgetName: "transport", budgetAmount: 400, totalTransactions: 400 },
//   { budgetName: "nourriture", budgetAmount: 305, totalTransactions: 200 },
//   { budgetName: "fast-food", budgetAmount: 237, totalTransactions: 120 },
//   { budgetName: "voyage", budgetAmount: 73, totalTransactions: 190 },
// ];

const chartConfig = {
  budgetAmount: {
    label: "le budget",
    color: "#cbd5e1",
  },
  totalTransactions: {
    label: "les transactions",
    color: "#4f46e5",
  },
} satisfies ChartConfig;

interface IchartDataProps {
  chart: IchartData[];
}

export function ChartUi({ chart }: IchartDataProps) {
  // console.log(chart);

  return (
    <div className="py-8">
      <ChartContainer config={chartConfig} className="max-h-[400px] max-w-full">
        <BarChart accessibilityLayer data={chart}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="budgetName" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 20)} className="capitalize font-semibold" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent className="py-4" />} />
          <Bar dataKey="budgetAmount" fill="var(--color-budgetAmount)" radius={4} />
          <Bar dataKey="totalTransactions" fill="var(--color-totalTransactions)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
