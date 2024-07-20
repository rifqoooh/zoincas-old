'use client';

import * as React from 'react';
import * as R from 'remeda';
import { Label, Pie, PieChart } from 'recharts';
import { convertFromMiliunits, formatCurrency } from '@/lib/utils';
import { CountUp } from '@/components/count-up';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useGetSummary } from '@/query/summary';
import { CardTitle } from '@/components/ui/card';
import { FileSearchIcon } from 'lucide-react';

export function CategoriesChart() {
  const summaryQuery = useGetSummary();
  const [summaryData] = summaryQuery.data || [];
  const categories = summaryData?.categories || [];

  const colors = ['#F23E94', '#22C6E1', '#2E90FA', '#7C3AED'];

  // merge data with colors
  const chartData = categories.map(({ name, amount }, index) => ({
    name: name.toLowerCase(),
    amount,
    fill: colors.at(index) ?? '#1E293B',
  }));

  const config = R.mapToObj(categories, (values) => [
    String(values.name.toLowerCase()),
    { label: values.name },
  ]);

  const chartConfig = config satisfies ChartConfig;

  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, values) => acc + values.amount, 0);
  }, [chartData]);

  const intAmount = Math.abs(Number(totalAmount.toString().slice(0, -3)));
  const floatAmount = Math.abs(Number(totalAmount.toString().slice(-3, -1)));

  if (summaryQuery.isLoading) {
    return (
      <>
        <Skeleton className="h-[300px] w-full bg-slate-200" />
      </>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4 border border-dashed">
        <FileSearchIcon className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No data.</p>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              valueFormatter={(value) =>
                formatCurrency(convertFromMiliunits(value))
              }
            />
          }
        />
        <Pie
          data={chartData}
          nameKey="name"
          dataKey="amount"
          innerRadius={105}
          strokeWidth={5}
          startAngle={90}
          endAngle={-270}
          cornerRadius={5}
          paddingAngle={2}
        >
          <Label
            position="center"
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <>
                    <foreignObject
                      x={0}
                      y={(viewBox.cy || 0) - 14}
                      className="w-full overflow-visible text-center"
                    >
                      <CardTitle className="line-clamp-1 break-all text-xl">
                        <span className="text-base text-muted-foreground">
                          Rp
                        </span>
                        <CountUp
                          preserveValue
                          useEasing
                          start={0}
                          end={intAmount}
                        />
                        <CountUp
                          preserveValue
                          className="text-base text-muted-foreground"
                          useEasing
                          start={0}
                          end={floatAmount}
                          formattingFn={(value) =>
                            `.${value.toString().padStart(2, '0')}`
                          }
                        />
                      </CardTitle>
                    </foreignObject>

                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {/* <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {formatCurrency(convertFromMiliunits(totalAmount))}
                      </tspan> */}
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        Total
                      </tspan>
                    </text>
                  </>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
