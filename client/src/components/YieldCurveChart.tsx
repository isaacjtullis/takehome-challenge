"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

export const description = "A multiple line chart"

const chartConfig = {
  test: {
    label: "Yield Curve",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function YieldCurveChart({ data }: { data: any }) {
  if(!data) return null;
  const chartData = data.filter((d: any) => typeof d.value === 'number');
  return (
    <div>
      <ChartContainer className="h-[300px] w-full" config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis
            domain={['dataMin - 0.1', 'dataMax + 0.1']}
            tickFormatter={(value) => value.toFixed(2)}
            tickLine={false}
            axisLine={false}
            tickMargin={16}
          />
          <XAxis
            dataKey="label"
            padding={{ left: 10, right: 10 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.replaceAll('_', ' ').replace('Month', 'mo').replace('Year', 'yr')}
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) =>
              active && payload?.length && payload[0] ? (
                <div className="rounded-md bg-white px-2 py-2 text-sm shadow">
                  <div className="text-sm">Yield: {typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value}% </div>
                  <div className="text-sm">Term: {payload[0].payload?.label?.replaceAll('_', ' ').replace('Month', 'mo').replace('Year', 'yr')}</div>
                </div>
              ) : null
            }
          />
          <Line
            dataKey="value"
            type="monotone"
            stroke="green"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
