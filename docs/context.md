# Subscription Tracker Mobile App Documentation

This document provides a detailed and structured explanation of the Subscription Tracker Mobile App's flow and features. It is intended as a guide for app developers to understand the architecture, user flow, and key components required for implementation.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [App Overview](#app-overview)
4. [User Flow](#user-flow)
5. [Features & Implementation](#features--implementation)
6. [UI/UX Screens and Descriptions](#uiux-screens-and-descriptions)
7. [Backend Architecture and Integration](#backend-architecture-and-integration)
8. [Database Schema](#database-schema)
9. [Application Structure](#application-structure)
10. [Additional Considerations](#additional-considerations)

---

## Introduction

The Subscription Tracker Mobile App is designed to help users manage and monitor their recurring subscription services. With an intuitive interface, users can track expenses, receive timely notifications before renewals, and gain insights into their subscription spending. This guide outlines the app's flow, detailed features, and development considerations.

---

## Tech Stack

- Frontend: 
  - React Native with TypeScript
  - Expo (for easier development and deployment)
  - React Navigation for routing
  - React Native Paper for UI components
- Backend: Supabase
  - Authentication
  - Database (PostgreSQL)
  - Real-time subscriptions
  - Storage for attachments
  - Edge Functions for complex operations
- API: 
  - Supabase Client SDK
  - RESTful endpoints for custom logic
  - Real-time subscriptions using Supabase
- Testing: Jest, React Native Testing Library
- CI/CD: GitHub Actions
- Development Tools:
  - Expo CLI
  - Android Studio / Xcode for native testing

---

## App Overview

- **Purpose:**  
  Provide users with a centralized platform to track, manage, and analyze their subscription expenses.

- **Target Audience:**  
  Young professionals, tech-savvy individuals, and anyone managing multiple recurring subscriptions.

- **Key Benefits:**  
  - Consolidated view of subscriptions  
  - Timely renewal reminders  
  - Expense analytics and budgeting tips  
  - Easy-to-use and minimalistic design

---

## User Flow

1. **Onboarding and Authentication:**
   - **Splash Screen:** Brief introduction or logo display.
   - **Onboarding Slides:** Short walkthrough of app features.
   - **User Authentication:** 
     - Option to Sign Up (via email or social media)
     - Option to Log In (for returning users)

2. **Initial Setup:**
   - **User Profile Setup:** Basic profile details (optional avatar, name, etc.)
   - **Subscription Entry:** Prompt user to add their first subscription or import existing data (if applicable).

3. **Main Dashboard:**
   - **Overview:** Display a summary of active subscriptions, upcoming renewals, and total monthly/annual expenses.
   - **Navigation:** Access to detailed subscription list, analytics, and settings.

4. **Adding/Editing Subscriptions:**
   - **Add New Subscription:** Form to input details such as service name, cost, billing cycle, start date, etc.
   - **Edit/Delete Subscription:** Options to update or remove existing subscriptions.

5. **Notifications & Reminders:**
   - **Alert Setup:** Automated reminders for upcoming renewals or cancellations.
   - **Notification Center:** View a log of past alerts and scheduled notifications.

6. **Analytics & Budgeting:**
   - **Spending Analytics:** Graphs and charts showing expenditure trends over time.
   - **Budget Recommendations:** Tips based on user spending habits and suggestions for cost-saving.

7. **Premium Features:**
   - **Upgrade Flow:** Seamless in-app purchase flow for unlocking advanced analytics, automated subscription detection, and integrations.
   - **Ad-Free Experience:** Option to remove in-app advertisements.

8. **User Settings & Profile:**
   - **Account Management:** Manage profile details, subscription plans, and payment methods.
   - **Preferences:** Notification settings, data sync options, and theme customization.

---

## Features & Implementation

### Subscription Management

- **Add/Edit/Delete Subscriptions:**
  - **Input Fields:** Service name, subscription cost, billing frequency (monthly/annual), start date, and optional notes.
  - **Editing:** Allow modifications to any field.
  - **Deletion:** Confirm deletion with a warning about data loss.

- **Subscription Categories:**
  - Users can categorize subscriptions (e.g., entertainment, productivity, utilities) to enable filtered views and targeted analytics.

### Dashboard & Analytics

- **Main Dashboard:**
  - **Summary Cards:** Quick view of total monthly and annual spending.
  - **Upcoming Renewals:** List or calendar view of subscriptions that will renew soon.
  
- **Analytics:**
  - **Spending Trends:** Visual graphs (bar charts, line graphs) displaying monthly/annual expenses.
  - **Budget Tips:** Based on usage and spending patterns, provide actionable advice on managing subscriptions.

### Reminders & Notifications

- **Automated Alerts:**
  - **Renewal Reminders:** Notifications set a few days before subscription renewals.
  - **Custom Alerts:** Users can set personalized reminders (e.g., for trial expiration dates).

- **Notification Center:**
  - Centralized area for all notifications, allowing users to review past alerts and upcoming reminders.

### User Profile & Settings

- **User Authentication:**
  - Secure sign-up/login processes.
  - Option to use third-party authentication providers (e.g., Google, Facebook).

- **Settings:**
  - **Notification Preferences:** Toggle types of notifications (email, in-app, SMS).
  - **Data Sync:** Option to backup data to the cloud or integrate with third-party services.
  - **Theme & Appearance:** Light/dark mode options.

### Premium Features & Monetization

- **Freemium Model:**
  - **Basic Version:** Free access to core features like manual subscription management, basic reminders, and standard analytics.
  - **Premium Version:** Paid upgrade unlocking advanced features such as:
    - Automated subscription detection (e.g., via email parsing or bank integrations)
    - Detailed analytics and trend reports
    - Ad-free experience
    - Priority customer support

- **Monetization Options:**
  - In-app purchases for premium features.
  - Optional advertisements in the free version (ensure non-intrusive placement).

---

## UI/UX Screens and Descriptions

1. **Splash & Onboarding Screens:**
   - **Purpose:** Brand introduction and app benefits overview.
   - **Components:** Logo, tagline, brief feature highlights, and a "Get Started" button.

2. **Authentication Screens:**
   - **Login/Signup Forms:** Input fields for email, password, and social media login options.
   - **Error Handling:** Clear messages for incorrect credentials or network issues.

3. **Dashboard Screen:**
   - **Overview Section:** Displays key metrics such as total spending and next renewal.
   - **Navigation Menu:** Tabs or a sidebar linking to Subscriptions, Analytics, Notifications, and Settings.

4. **Subscription Detail Screen:**
   - **Subscription List:** Scrollable list with basic subscription details.
   - **Detail View:** On selecting a subscription, show full details with options to edit or delete.

5. **Add/Edit Subscription Screen:**
   - **Form Layout:** Clearly labeled fields for input.
   - **Validation:** Real-time validation for cost fields and date pickers.
   - **Save/Cancel Buttons:** Easy navigation to commit or cancel changes.

6. **Analytics Screen:**
   - **Visual Reports:** Charts and graphs summarizing spending trends.
   - **Filter Options:** Allow users to filter data by category, date range, etc.

7. **Notification Center:**
   - **List Format:** Chronologically ordered notifications with status (upcoming, dismissed, etc.).
   - **Action Buttons:** Options to mark as read, snooze, or view details.

8. **Settings Screen:**
   - **Account Settings:** Options to update profile, change password, manage subscription plans.
   - **App Preferences:** Toggle notification settings, data backup preferences, and theme options.

---

## Backend Architecture and Integration

- **Database:**  
  Store user data, subscription details, and notification settings. Consider using a scalable database (e.g., Supabase).

- **API Endpoints:**  
  - **User Authentication:** Endpoints for signup, login, password reset.
  - **Subscription CRUD:** Create, Read, Update, Delete operations for subscriptions.
  - **Analytics Data:** Endpoints to retrieve and process spending data.
  - **Notification Scheduling:** Services to schedule and send reminders.

- **Third-Party Integrations:**  
  - **Email Parsing/Bank Integration (Premium):** For automated subscription detection.
  - **Push Notifications:** Integration with Firebase Cloud Messaging or similar services.

- **Security Considerations:**  
  - Implement secure authentication protocols.
  - Ensure data is encrypted both in transit and at rest.
  - Regularly update dependencies and monitor for vulnerabilities.

---

## Database Schema

### Users Table (handled by Supabase Auth)
```sql
-- This table is automatically managed by Supabase Auth
-- Additional user metadata can be stored in profiles table

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);
```

### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(7),
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own categories" 
    ON categories FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
    ON categories FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
    ON categories FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
    ON categories FOR DELETE 
    USING (auth.uid() = user_id);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    category_id UUID REFERENCES categories(id),
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transactions" 
    ON transactions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
    ON transactions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
    ON transactions FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
    ON transactions FOR DELETE 
    USING (auth.uid() = user_id);
```

### Budgets Table
```sql
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    category_id UUID REFERENCES categories(id),
    amount DECIMAL(12,2) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own budgets" 
    ON budgets FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" 
    ON budgets FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" 
    ON budgets FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" 
    ON budgets FOR DELETE 
    USING (auth.uid() = user_id);
```

### Tags Table
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tags" 
    ON tags FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags" 
    ON tags FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" 
    ON tags FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" 
    ON tags FOR DELETE 
    USING (auth.uid() = user_id);
```

### Transaction_Tags Table
```sql
CREATE TABLE transaction_tags (
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (transaction_id, tag_id)
);

-- Enable RLS
ALTER TABLE transaction_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transaction tags" 
    ON transaction_tags FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM transactions 
            WHERE transactions.id = transaction_id 
            AND transactions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own transaction tags" 
    ON transaction_tags FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM transactions 
            WHERE transactions.id = transaction_id 
            AND transactions.user_id = auth.uid()
        )
    );
```

---

## Application Structure

```
subscription-tracker/
├── mobile/                 # React Native application
│   ├── App.tsx            # Root component
│   ├── app.json           # Expo configuration
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Screen components
│   │   ├── navigation/    # Navigation configuration
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service calls
│   │   ├── utils/        # Helper functions
│   │   ├── context/      # React context providers
│   │   ├── assets/       # Images, fonts, etc.
│   │   └── theme/        # Theme configuration
│   └── package.json
│
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   └── context.md        # This file (app context)
│
├── tests/                # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/              # GitHub workflows and templates
├── .gitignore
└── README.md

---

## Key Features
- Cross-platform mobile app (iOS & Android)
- User authentication via Supabase Auth
- Real-time subscription updates
- Push notifications for renewal reminders
- Offline support with local storage sync
- Beautiful native UI components
- Secure data handling
- Export functionality for reports
- Subscription tracking and alerts

---

## Additional Considerations

- **Scalability:**  
  Design the system to handle increasing user data, with considerations for cloud hosting and load balancing.

- **User Feedback Loop:**  
  Incorporate in-app feedback mechanisms to gather user insights and iterate on feature improvements.

- **Compliance:**  
  Ensure the app complies with data privacy regulations (e.g., GDPR, CCPA) if collecting and storing personal data.

- **Future Enhancements:**  
  - Expand automated detection to include more integration channels.
  - Add collaborative features for family or shared subscriptions.
  - Introduce AI-driven recommendations for cost-saving.

---

## Conclusion

This document outlines the complete flow and features of the Subscription Tracker Mobile App, covering everything from user onboarding to advanced analytics and monetization strategies. The aim is to create a user-friendly and scalable app that addresses a common pain point in subscription management, while also offering potential for monetization through premium features.

Developers can use this documentation as a blueprint for both the frontend and backend architecture, ensuring a smooth development process and a robust, profitable final product.
