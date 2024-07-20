'use client';

import {
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  Area,
  Line,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency, convertFromMiliunits } from '@/lib/utils';
import { useGetSummary } from '@/query/summary';
import { FileSearchIcon } from 'lucide-react';

export function NetWorthChart() {
  const summaryQuery = useGetSummary();
  const [summaryData] = summaryQuery.data || [];
  const chartData = summaryData?.chartData;

  const chartConfig = {
    income: {
      label: 'Income',
    },
    expense: {
      label: 'Expense',
    },
  } satisfies ChartConfig;

  if (summaryQuery.isLoading) {
    return (
      <>
        <Skeleton className="h-[390px] w-full bg-slate-200" />
      </>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-[390px] w-full flex-col items-center justify-center gap-4 border border-dashed">
        <FileSearchIcon className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No data.</p>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[390px] w-full [&_.recharts-dot[stroke='#fff']]:stroke-white"
    >
      <RechartsAreaChart accessibilityLayer data={chartData}>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          verticalAlign="top"
          className="justify-end"
        />

        <CartesianGrid horizontal={false} vertical={false} />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          ticks={[chartData.at(0)?.date ?? '', chartData.at(-1)?.date ?? '']}
          interval={'preserveStartEnd'}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              valueFormatter={(value) => formatCurrency(value)}
            />
          }
        />

        <defs>
          <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          key="income"
          name="income"
          // dataKey="income"
          dataKey={(data) => convertFromMiliunits(data.income)}
          fill="url(#fillIncome)"
          fillOpacity={0.4}
          stroke="#22c55e"
          strokeWidth={2}
          activeDot={{ r: 5 }}
        />

        <Area
          key="expense"
          name="expense"
          // dataKey="expense"
          dataKey={(data) => convertFromMiliunits(Math.abs(data.expense))}
          fill="url(#fillExpense)"
          fillOpacity={0.4}
          stroke="#ef4444"
          strokeWidth={2}
          activeDot={{ r: 5 }}
        />

        {/* <Line
          key="expense"
          dataKey="expense"
          fill="transparent"
          stroke="transparent"
          strokeWidth={2}
        />

        <Line
          key="income"
          dataKey="income"
          stroke="transparent"
          fill="transparent"
          strokeWidth={2}
        /> */}
      </RechartsAreaChart>
    </ChartContainer>
  );
}
