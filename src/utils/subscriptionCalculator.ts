import { Subscription } from '../types';

export function calculateMonthlySpending(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, subscription) => {
    const amount = subscription.amount || 0;
    if (subscription.billing_frequency === 'monthly') {
      return total + amount;
    } else if (subscription.billing_frequency === 'annually') {
      return total + (amount / 12);
    }
    return total;
  }, 0);
}

export function calculateAnnualSpending(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, subscription) => {
    const amount = subscription.amount || 0;
    if (subscription.billing_frequency === 'monthly') {
      return total + (amount * 12);
    } else if (subscription.billing_frequency === 'annually') {
      return total + amount;
    }
    return total;
  }, 0);
}

export function getUpcomingRenewals(subscriptions: Subscription[], daysThreshold = 7): Subscription[] {
  const now = new Date();
  const thresholdDate = new Date(now.getTime() + (daysThreshold * 24 * 60 * 60 * 1000));
  
  return subscriptions
    .filter(subscription => {
      const renewalDate = new Date(subscription.start_date);
      
      // Adjust the renewal date based on billing frequency
      if (subscription.billing_frequency === 'monthly') {
        renewalDate.setMonth(now.getMonth() + 1);
      } else {
        renewalDate.setFullYear(now.getFullYear() + 1);
      }
      
      return renewalDate <= thresholdDate && renewalDate >= now;
    })
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
}

export function calculateSpendingByCategory(subscriptions: Subscription[]): Record<string, number> {
  return subscriptions.reduce((categories, subscription) => {
    const category = subscription.category || 'Other';
    const monthlyAmount = subscription.billing_frequency === 'monthly' 
      ? subscription.amount 
      : subscription.amount / 12;
    
    return {
      ...categories,
      [category]: (categories[category] || 0) + monthlyAmount,
    };
  }, {} as Record<string, number>);
}
