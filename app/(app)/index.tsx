import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { Subscription } from '../../src/types';
import { SummaryCard } from '../../src/components/SummaryCard';
import {
  calculateMonthlySpending,
  calculateAnnualSpending,
  getUpcomingRenewals,
} from '../../src/utils/subscriptionCalculator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
  const router = useRouter();
  const theme = useTheme();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  async function loadSubscriptions() {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setSubscriptions(data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadSubscriptions();
  }, []);

  const monthlySpending = calculateMonthlySpending(subscriptions);
  const annualSpending = calculateAnnualSpending(subscriptions);
  const upcomingRenewals = getUpcomingRenewals(subscriptions);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      <View style={[styles.headerContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[{ height: insets.top }]} />
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Your Dashboard
          </Text>
          <Button 
            mode="contained" 
            onPress={() => router.push('/(app)/subscriptions/add')}
            icon="plus"
            style={styles.addButton}
          >
            Add New
          </Button>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Card style={[styles.card, { backgroundColor: theme.colors.errorContainer }]}>
            <Card.Content style={styles.errorContent}>
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={24} 
                color={theme.colors.error}
              />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </Card.Content>
          </Card>
        </View>
      )}

      <View style={styles.summaryContainer}>
        <SummaryCard
          title="Monthly"
          amount={monthlySpending}
          icon="cash-multiple"
          subtitle={`${subscriptions.length} active subscriptions`}
          index={0}
        />
        <SummaryCard
          title="Annual Total"
          amount={annualSpending}
          icon="chart-timeline-variant"
          subtitle="Projected yearly spending"
          index={1}
        />
      </View>

      <View style={styles.renewalsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Upcoming Renewals
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Next 7 days
          </Text>
        </View>
        
        {upcomingRenewals.length > 0 ? (
          upcomingRenewals.map((subscription) => (
            <Card 
              key={subscription.id} 
              style={[styles.renewalCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push(`/(app)/subscriptions/${subscription.id}`)}
            >
              <Card.Content style={styles.renewalContent}>
                <View style={styles.renewalLeft}>
                  <Text style={[styles.renewalName, { color: theme.colors.onSurface }]}>
                    {subscription.name}
                  </Text>
                  <Text style={[styles.renewalDate, { color: theme.colors.onSurfaceVariant }]}>
                    Renews {new Date(subscription.start_date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.renewalRight}>
                  <Text style={[styles.renewalAmount, { color: theme.colors.primary }]}>
                    ${subscription.amount}
                  </Text>
                  <Text style={[styles.renewalFrequency, { color: theme.colors.onSurfaceVariant }]}>
                    {subscription.billing_frequency}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons 
                name="calendar-check-outline" 
                size={32} 
                color={theme.colors.onSurfaceVariant}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No upcoming renewals in the next 7 days
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  card: {
    borderRadius: 8,
    elevation: 2,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  errorContainer: {
    padding: 16,
    paddingTop: 8,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-between',
  },
  renewalsSection: {
    marginTop: 8,
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  renewalCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  renewalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  renewalLeft: {
    flex: 1,
  },
  renewalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  renewalDate: {
    fontSize: 12,
  },
  renewalRight: {
    alignItems: 'flex-end',
  },
  renewalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  renewalFrequency: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyCard: {
    marginHorizontal: 16,
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 12,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
  },
});
