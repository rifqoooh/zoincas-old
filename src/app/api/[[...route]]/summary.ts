import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { differenceInDays, parse, subDays } from 'date-fns';
import {
  calculatePercentageDifference,
  fillMissingDate,
  supabaseMiddleware,
} from '@/lib/utils';
import {
  getCategorySummary,
  getIncomeExpenseSummary,
  getIncomeExpenseSummaryByDate,
} from '@/server/transactions';

const app = new Hono().get(
  '/',
  supabaseMiddleware(),
  zValidator(
    'query',
    z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const query = c.req.valid('query');

    const defaultEndDate = new Date();
    const defaultStartDate = subDays(defaultEndDate, 30);

    const startDate = query.startDate
      ? parse(query.startDate, 'MM-dd-yyyy', new Date())
      : defaultStartDate;
    const endDate = query.endDate
      ? parse(query.endDate, 'MM-dd-yyyy', new Date())
      : defaultEndDate;

    const periodLength = differenceInDays(endDate, startDate);
    const offset = 1;

    const periodStartDate = subDays(startDate, periodLength + offset);
    const periodEndDate = subDays(endDate, periodLength + offset);

    const [currentPeriod] = await getIncomeExpenseSummary({
      startDate,
      endDate,
      accountId: query.accountId,
    });

    const [previousPeriod] = await getIncomeExpenseSummary({
      startDate: periodStartDate,
      endDate: periodEndDate,
      accountId: query.accountId,
    });

    const incomeDifference = calculatePercentageDifference(
      currentPeriod.income,
      previousPeriod.income
    );

    const expenseDifference = calculatePercentageDifference(
      currentPeriod.expense,
      previousPeriod.expense
    );

    const remainingDifference = calculatePercentageDifference(
      currentPeriod.remaining,
      previousPeriod.remaining
    );

    const categorySummary = await getCategorySummary({
      startDate,
      endDate,
      accountId: query.accountId,
    });

    const topCategories = categorySummary.slice(0, 3);

    const otherCategories = categorySummary.slice(3);
    const otherCategoriesAmount = otherCategories.reduce((amount, category) => {
      return amount + category.amount;
    }, 0);

    const finalCategorySummary = [...topCategories];
    if (otherCategories.length > 0) {
      finalCategorySummary.push({
        name: 'Other',
        amount: otherCategoriesAmount,
      });
    }

    const summaryByDate = await getIncomeExpenseSummaryByDate({
      startDate,
      endDate,
      accountId: query.accountId,
    });

    const chartData = fillMissingDate({
      dates: summaryByDate,
      startDate,
      endDate,
    });

    const data = [
      {
        income: {
          amount: currentPeriod.income,
          difference: incomeDifference,
        },
        expense: {
          amount: currentPeriod.expense,
          difference: expenseDifference,
        },
        remaining: {
          amount: currentPeriod.remaining,
          difference: remainingDifference,
        },
        categories: finalCategorySummary,
        chartData,
      },
    ];

    if (!data) {
      return c.json(
        {
          data: [],
          error: [{ message: 'The requested resource was not found' }],
        },
        404
      );
    }

    return c.json(
      {
        data: data,
        error: [],
      },
      200
    );
  }
);

export default app;
