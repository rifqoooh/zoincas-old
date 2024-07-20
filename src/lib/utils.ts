import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@/lib/supabase/auth/server';
import { MiddlewareHandler } from 'hono';
import { sql, is, type AnyColumn, type SQL } from 'drizzle-orm';
import { PgTimestampString, type SelectedFields } from 'drizzle-orm/pg-core';
import { type SelectResultFields } from 'drizzle-orm/query-builders/select.types';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import * as R from 'remeda';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export const supabaseMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const supabase = await createClient();
    const { data: auth, error } = await supabase.auth.getUser();

    if (error || !auth?.user) {
      return c.json(
        {
          status: 401,
          message: 'Unauthorized',
          data: [],
        },
        401
      );
    }

    await next();
  };
};

export function formatCurrency(
  value: number | string,
  options: {
    currency?: 'USD' | 'IDR';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'IDR', notation = 'standard' } = options;

  // convert to float if passed price is string
  const number = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('id', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(number);
}

export function calculateTotal({
  amount,
  quantity,
  discount,
  tax,
}: {
  amount: number;
  quantity: number;
  discount: number;
  tax: number;
}) {
  return amount * quantity - discount + tax;
}

export function convertToMiliunits(value: string | number) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return numericValue * 1000;
}

export function convertFromMiliunits(value: string | number) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return numericValue / 1000;
}

export function calculatePercentageDifference(
  current: number,
  previous: number
) {
  if (previous === 0) return previous === current ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

export function fillMissingDate(options: {
  dates: { date: string; income: number; expense: number }[];
  startDate: Date;
  endDate: Date;
}) {
  const { dates, startDate, endDate } = options;

  if (dates.length === 0) return [];

  const datesInterval = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const datesObject = R.mapToObj(dates, (values) => [
    values.date,
    { income: values.income, expense: values.expense },
  ]);

  const filledDates = datesInterval.map((date) => {
    const dateString = format(date, 'yyyy-MM-dd');

    if (datesObject[dateString] === undefined) {
      return {
        date: format(date, 'd MMM yyyy'),
        income: 0,
        expense: 0,
      };
    }

    const { income, expense } = datesObject[dateString];

    return {
      date: format(date, 'd MMM yyyy'),
      income: income,
      expense: expense,
    };
  });

  return filledDates;
}

export function formatDateRange(period: {
  startDate?: string | Date;
  endDate?: string | Date;
}) {
  const defaultEndDate = new Date();
  const defaultStartDate = subDays(defaultEndDate, 30);

  if (!period.startDate) {
    return `${format(defaultStartDate, 'LLL dd')} - ${format(defaultEndDate, 'LLL dd, y')}`;
  }

  if (!!period.endDate) {
    return `${format(period.startDate, 'LLL dd')} - ${format(period.endDate, 'LLL dd, y')}`;
  }

  return format(period.startDate, 'LLL dd');
}

export function formatPercentage(
  value: number,
  options: { prefix?: boolean } = { prefix: true }
) {
  const formatted = new Intl.NumberFormat('id', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(value / 100);

  return options.prefix && value > 0 ? `+${formatted}` : formatted;
}

export function formatCompactNumber(value: number | string) {
  // convert to float if passed price is string
  const number = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('en', {
    notation: 'compact',
  }).format(number);
}

// drizzle utils stuff
export function coalesce<T>(value: SQL.Aliased<T> | SQL<T>, defaultValue: any) {
  return sql<T>`coalesce(${value}, ${defaultValue})`;
}

export function jsonBuildObject<T extends SelectedFields>(shape: T) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }

    chunks.push(sql.raw(`'${key}',`));

    // json_build_object formats to ISO 8601 ...
    if (is(value, PgTimestampString)) {
      chunks.push(sql`timezone('UTC', ${value})`);
    } else {
      chunks.push(sql`${value}`);
    }
  });

  return sql<SelectResultFields<T>>`coalesce(json_build_object(${sql.join(
    chunks
  )}), '{}')`;
}

export function jsonAggBuildObject<
  T extends SelectedFields,
  Column extends AnyColumn,
>(
  shape: T,
  options?: {
    orderBy?: { colName: Column; direction: 'ASC' | 'DESC' };
    notNullColumn?: keyof T;
  }
) {
  return sql<
    SelectResultFields<T>[]
  >`coalesce(jsonb_agg(${jsonBuildObject(shape)}${
    options?.orderBy
      ? sql`order by ${options.orderBy.colName} ${sql.raw(options.orderBy.direction)}`
      : undefined
  })${options?.notNullColumn ? sql` filter (where ${shape[options.notNullColumn]} is not null)` : sql.raw('')}, '${sql`[]`}')`;
}
