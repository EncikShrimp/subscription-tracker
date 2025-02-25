export type SubscriptionCategory =
  | 'Entertainment'
  | 'Productivity'
  | 'Utilities'
  | 'Health & Fitness'
  | 'Education'
  | 'Shopping'
  | 'Music'
  | 'Gaming'
  | 'Cloud Storage'
  | 'Other';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  billing_frequency: 'monthly' | 'annually';
  start_date: string;
  category: SubscriptionCategory;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  updated_at: string;
}
