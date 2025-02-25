import { Subscription } from '../types';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
}

export function calculateMonthlySpending(subscriptions: Subscription[]): MonthlySpending[] {
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 5);
  const months = eachMonthOfInterval({
    start: startOfMonth(sixMonthsAgo),
    end: endOfMonth(today),
  });

  return months.map(month => {
    const monthlyTotal = subscriptions.reduce((total, sub) => {
      if (sub.billing_frequency === 'monthly') {
        return total + sub.amount;
      } else if (sub.billing_frequency === 'annually') {
        return total + (sub.amount / 12);
      }
      return total;
    }, 0);

    return {
      month: format(month, 'MMM yyyy'),
      amount: monthlyTotal,
    };
  });
}

export function calculateCategorySpending(subscriptions: Subscription[]): CategorySpending[] {
  const categoryTotals = subscriptions.reduce((acc, sub) => {
    const category = sub.category || 'Uncategorized';
    const monthlyAmount = sub.billing_frequency === 'annually' 
      ? sub.amount / 12 
      : sub.amount;

    acc[category] = (acc[category] || 0) + monthlyAmount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / total) * 100,
  })).sort((a, b) => b.amount - a.amount);
}

export function calculateTotalSpending(subscriptions: Subscription[]) {
  return subscriptions.reduce((total, sub) => {
    const monthlyAmount = sub.billing_frequency === 'annually' 
      ? sub.amount / 12 
      : sub.amount;
    return total + monthlyAmount;
  }, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
