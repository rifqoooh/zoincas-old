'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import {
  ResponsiveContainer,
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: any[];
}

export function AreaChart({ className, data, ...props }: AreaChartProps) {
  data = [
    {
      date: 'Jan 22',
      income: 2890,
      expense: 2338,
    },
    {
      date: 'Feb 22',
      income: 2756,
      expense: 2103,
    },
    {
      date: 'Mar 22',
      income: 3322,
      expense: 2194,
    },
    {
      date: 'Apr 22',
      income: 3470,
      expense: 2108,
    },
    {
      date: 'May 22',
      income: 3475,
      expense: 1812,
    },
    {
      date: 'Jun 22',
      income: 3129,
      expense: 1726,
    },
    {
      date: 'Jul 22',
      income: 3490,
      expense: 1982,
    },
    {
      date: 'Aug 22',
      income: 2903,
      expense: 2012,
    },
    {
      date: 'Sep 22',
      income: 2643,
      expense: 2342,
    },
    {
      date: 'Oct 22',
      income: 2837,
      expense: 2473,
    },
    {
      date: 'Nov 22',
      income: 2954,
      expense: 3848,
    },
    {
      date: 'Dec 22',
      income: 3239,
      expense: 3736,
    },
  ];

  interface TypeDiffData {
    [key: string]: {
      income: number;
      expense: number;
      incomeInfo: string;
      expenseInfo: string;
    };
  }

  const diffData: TypeDiffData = {};
  data.forEach(({ date, income, expense }, index, self) => {
    if (index === 0) {
      diffData[date] = {
        income: income - self[0].income,
        expense: expense - self[0].expense,
        incomeInfo: '',
        expenseInfo: '',
      };
      return;
    }

    const diffIncome = income - self[index - 1].income;
    const infoIncome = (
      (Math.abs(diffIncome) / self[index - 1].income) *
      100
    ).toFixed(2);

    const diffExpense = expense - self[index - 1].expense;
    const infoExpense = (
      (Math.abs(diffExpense) / self[index - 1].expense) *
      100
    ).toFixed(2);

    diffData[date] = {
      income: diffIncome,
      expense: diffExpense,
      incomeInfo: infoIncome,
      expenseInfo: infoExpense,
    };
  });

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean | undefined;
    payload: any;
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-white shadow-md">
          <p className="border-b bg-slate-100 px-4 py-2 text-lg font-medium">
            {label}
          </p>
          <div className="px-4 py-2">
            <div className="flex items-center justify-between space-x-8">
              <div className="flex items-center space-x-2">
                <span className="size-2 shrink-0 rounded-full bg-green-700" />
                <p className="font-medium text-muted-foreground">{`${payload[0].name}: ${payload[0].value}`}</p>
              </div>
              <p
                className={cn(
                  'font-medium text-muted-foreground',
                  { 'text-green-500': diffData[label].income > 0 },
                  { 'text-red-500': diffData[label].income < 0 }
                )}
              >
                {diffData[label].income === 0
                  ? null
                  : `${diffData[label].income} (${diffData[label].incomeInfo}%)`}
              </p>
            </div>

            <div className="flex items-center justify-between space-x-8">
              <div className="flex items-center space-x-2">
                <span className="size-2 shrink-0 rounded-full bg-red-700" />
                <p className="font-medium text-muted-foreground">{`${payload[1].name}: ${payload[1].value}`}</p>
              </div>

              <p
                className={cn(
                  'font-medium text-muted-foreground',
                  { 'text-green-500': diffData[label].expense > 0 },
                  { 'text-red-500': diffData[label].expense < 0 }
                )}
              >
                {diffData[label].expense === 0
                  ? null
                  : `${diffData[label].expense} (${diffData[label].expenseInfo}%)`}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="sm:col-span-2">
      <CardHeader>
        <CardTitle>Area Chart - Gradient</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} id="charts">
            {/* grid */}
            <CartesianGrid horizontal={false} vertical={false} />

            {/* x-axis */}
            <XAxis
              hide={true}
              className="text-xs"
              padding={{ left: -5, right: -5 }}
              dataKey={'date'}
              fill=""
              stroke=""
            />

            {/* y-axis */}
            <YAxis hide={true} className="text-xs" fill="" stroke="" />

            <Tooltip
              isAnimationActive={false}
              position={{ y: 0 }}
              content={({ active, payload, label }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  label={label}
                />
              )}
            />

            <defs key={'income'}>
              <linearGradient
                className="text-green-500"
                id={'income'}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <defs key={'expense'}>
              <linearGradient
                className="text-red-500"
                id={'expense'}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              className="stroke-green-700"
              key={'income'}
              name={'income'}
              dataKey={'income'}
              stroke=""
              fill={'url(#income)'}
              strokeWidth={2}
              activeDot={{ className: 'fill-green-700', r: 5 }}
              animationEasing="ease-in-out"
              animationDuration={750}
            />

            <Area
              className="stroke-red-700"
              key={'expense'}
              name={'expense'}
              dataKey={'expense'}
              stroke=""
              fill={'url(#expense)'}
              strokeWidth={2}
              activeDot={{ className: 'fill-red-700', r: 5 }}
              animationEasing="ease-in-out"
              animationDuration={750}
            />

            <Line
              key={'income'}
              name={'income'}
              dataKey={'income'}
              stroke="transparent"
              fill="transparent"
            />

            <Line
              key={'expense'}
              name={'expense'}
              dataKey={'expense'}
              stroke="transparent"
              fill="transparent"
            />

            {/* <Line
              className="cursor-pointer"
              strokeOpacity={0}
              key={'income'}
              name={'income'}
              dataKey={'income'}
              stroke="transparent"
              fill="transparent"
              legendType="none"
              tooltipType="none"
              strokeWidth={12}
              connectNulls={false}
            /> */}

            {/* <Line
              className="cursor-pointer"
              strokeOpacity={0}
              key={'expense'}
              name={'expense'}
              dataKey={'expense'}
              stroke="transparent"
              fill="transparent"
              legendType="none"
              tooltipType="none"
              strokeWidth={12}
              connectNulls={false}
            /> */}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
