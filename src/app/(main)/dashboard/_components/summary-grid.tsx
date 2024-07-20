'use client';

import { useSearchParams } from 'next/navigation';
import { CountUp } from '@/components/count-up';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoriesBarList } from './categories-bar-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  Area,
} from 'recharts';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { NetWorthChart } from './net-worth-chart';
import { CategoriesChart } from './categories-chart';
import {
  cn,
  convertFromMiliunits,
  formatDateRange,
  formatPercentage,
} from '@/lib/utils';
import { useGetSummary } from '@/query/summary';

export function SummaryGrid() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;

  const dateRangeLabel = formatDateRange({ startDate, endDate });

  const summaryQuery = useGetSummary();
  const [summaryData] = summaryQuery.data || [];

  return (
    <section className="grid gap-4 xl:grid-cols-6">
      <SummaryCard
        className="xl:col-span-3"
        title="Income"
        amount={summaryData?.income.amount}
        difference={summaryData?.income.difference}
        dateRangeLabel={dateRangeLabel}
        sparkData={{
          data: summaryData?.chartData,
          XAxisOptions: { dataKey: 'date' },
          AreaOptions: { dataKey: 'income', color: '#22c55e' },
        }}
        isLoading={summaryQuery.isLoading}
      />
      <SummaryCard
        className="xl:col-span-3"
        title="Expense"
        amount={summaryData?.expense.amount}
        difference={summaryData?.expense.difference}
        dateRangeLabel={dateRangeLabel}
        sparkData={{
          data: summaryData?.chartData,
          XAxisOptions: { dataKey: 'date' },
          AreaOptions: { dataKey: 'expense', color: '#ef4444' },
        }}
        isLoading={summaryQuery.isLoading}
      />
      <SummaryChart
        className="xl:col-span-4"
        title="Net worth"
        amount={summaryData?.remaining.amount}
        difference={summaryData?.remaining.difference}
        dateRangeLabel={dateRangeLabel}
        isLoading={summaryQuery.isLoading}
      />

      <CategoriesChartCard
        className="xl:col-span-2"
        title="Categories"
        dateRangeLabel={dateRangeLabel}
        isLoading={summaryQuery.isLoading}
      />
    </section>
  );
}

type SummarySparkOptions = {
  data: any[];
  XAxisOptions: {
    dataKey: string;
  };
  AreaOptions: {
    dataKey: string;
    color: string;
  };
};

interface CardProps {
  className?: string;
  title: string;
  amount: number;
  difference: number;
  dateRangeLabel: string;
  isLoading: boolean;
}

interface SummaryCardProps extends CardProps {
  sparkData: SummarySparkOptions;
}

export function SummaryCard({
  className,
  title,
  amount = 0,
  difference,
  dateRangeLabel,
  sparkData,
  isLoading,
}: SummaryCardProps) {
  const intAmount = Math.abs(Number(amount.toString().slice(0, -3)));
  const floatAmount = Math.abs(Number(amount.toString().slice(-3, -1)));

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>

        <div className="flex flex-row items-center justify-between">
          <section className="space-y-1.5">
            {isLoading ? (
              <Skeleton className="h-8 w-40 bg-slate-200" />
            ) : (
              <CardTitle className="line-clamp-1 break-all">
                <span className="text-lg text-muted-foreground">Rp</span>
                <CountUp preserveValue useEasing start={0} end={intAmount} />
                <CountUp
                  preserveValue
                  className="text-lg text-muted-foreground"
                  useEasing
                  start={0}
                  end={floatAmount}
                  formattingFn={(value) =>
                    `.${value.toString().padStart(2, '0')}`
                  }
                />
              </CardTitle>
            )}

            {isLoading ? (
              <Skeleton className="h-5 w-52 bg-slate-200" />
            ) : (
              <CardDescription
                className={cn('line-clamp-1', {
                  'text-emerald-500': difference > 0,
                  'text-rose-500': difference < 0,
                })}
              >
                {`${formatPercentage(difference)} from previous period`}
              </CardDescription>
            )}

            {isLoading ? (
              <Skeleton className="h-6 w-36 bg-slate-200" />
            ) : (
              <CardDescription className="text-base">
                {dateRangeLabel}
              </CardDescription>
            )}
          </section>

          {isLoading ? (
            <Skeleton className="h-20 w-60 bg-slate-200" />
          ) : (
            <SummarySpark
              data={sparkData.data}
              XAxisOptions={sparkData.XAxisOptions}
              AreaOptions={sparkData.AreaOptions}
            />
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

interface SummarySparkProps {
  data: any[];
  XAxisOptions: {
    dataKey: string;
  };
  AreaOptions: {
    dataKey: string;
    color: string;
  };
}

export function SummarySpark({
  data,
  XAxisOptions,
  AreaOptions,
}: SummarySparkProps) {
  const chartConfig = {
    [AreaOptions.dataKey]: {
      label: AreaOptions.dataKey.toUpperCase(),
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-20 w-56">
      <RechartsAreaChart data={data}>
        <CartesianGrid horizontal={false} vertical={false} />

        <XAxis dataKey={XAxisOptions.dataKey} hide={true} />

        <defs>
          <linearGradient
            id={`fill${AreaOptions.dataKey.toUpperCase()}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={AreaOptions.color} stopOpacity={0.5} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          // dataKey={AreaOptions.dataKey}
          dataKey={(data) =>
            convertFromMiliunits(Math.abs(data[AreaOptions.dataKey]))
          }
          fill={`url(#fill${AreaOptions.dataKey.toUpperCase()})`}
          fillOpacity={0.4}
          stroke={AreaOptions.color}
          strokeWidth={2}
        />
      </RechartsAreaChart>
    </ChartContainer>
  );
}

interface SummaryChartProps extends CardProps {}

export function SummaryChart({
  className,
  title,
  amount = 0,
  difference,
  dateRangeLabel,
  isLoading,
}: SummaryChartProps) {
  const intAmount = Math.abs(Number(amount.toString().slice(0, -3)));
  const floatAmount = Math.abs(Number(amount.toString().slice(-3, -1)));

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>

        {isLoading ? (
          <Skeleton className="h-8 w-40 bg-slate-200" />
        ) : (
          <CardTitle className="line-clamp-1 break-all text-2xl">
            <span className="text-lg text-muted-foreground">Rp</span>
            <CountUp preserveValue useEasing start={0} end={intAmount} />
            <CountUp
              preserveValue
              className="text-lg text-muted-foreground"
              useEasing
              start={0}
              end={floatAmount}
              formattingFn={(value) => `.${value.toString().padStart(2, '0')}`}
            />
          </CardTitle>
        )}

        {isLoading ? (
          <Skeleton className="h-5 w-52 bg-slate-200" />
        ) : (
          <CardDescription
            className={cn('line-clamp-1', {
              'text-emerald-500': difference > 0,
              'text-rose-500': difference < 0,
            })}
          >
            {`${formatPercentage(difference)} from previous period`}
          </CardDescription>
        )}

        {isLoading ? (
          <Skeleton className="h-6 w-36 bg-slate-200" />
        ) : (
          <CardDescription className="text-base">
            {dateRangeLabel}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <NetWorthChart />
      </CardContent>
    </Card>
  );
}

interface CategoriesChartCardProps {
  className?: string;
  title: string;
  dateRangeLabel: string;
  isLoading: boolean;
}

export function CategoriesChartCard({
  className,
  title,
  dateRangeLabel,
  isLoading,
}: CategoriesChartCardProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>

        {isLoading ? (
          <Skeleton className="h-6 w-36 bg-slate-200" />
        ) : (
          <CardDescription className="text-base">
            {dateRangeLabel}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-2">
        <CategoriesChart />
        <CategoriesBarList />
      </CardContent>
    </Card>
  );
}
