-- Add category column to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN category TEXT;

-- Create categories enum type
CREATE TYPE subscription_category AS ENUM (
  'Entertainment',
  'Productivity',
  'Utilities',
  'Health & Fitness',
  'Education',
  'Shopping',
  'Music',
  'Gaming',
  'Cloud Storage',
  'Other'
);

-- Add category constraint
ALTER TABLE subscriptions
ADD CONSTRAINT valid_category CHECK (
  category = ANY (
    ARRAY[
      'Entertainment',
      'Productivity',
      'Utilities',
      'Health & Fitness',
      'Education',
      'Shopping',
      'Music',
      'Gaming',
      'Cloud Storage',
      'Other'
    ]
  )
);
