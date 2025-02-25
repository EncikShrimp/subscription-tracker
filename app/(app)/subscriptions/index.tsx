import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Portal, Dialog, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../../src/lib/supabase';
import { Subscription } from '../../../src/types';
import { SubscriptionCard } from '../../../src/components/SubscriptionCard';
import { LoadingScreen } from '../../../src/components/LoadingScreen';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { SummaryCard } from '../../../src/components/SummaryCard';

export default function SubscriptionsList() {
  const router = useRouter();
  const theme = useTheme();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalAnnual, setTotalAnnual] = useState(0);

  async function loadSubscriptions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubscriptions(data || []);
      calculateTotals(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function calculateTotals(subs: Subscription[]) {
    let monthly = 0;
    let annual = 0;

    subs.forEach((sub) => {
      if (sub.billing_frequency === 'monthly') {
        monthly += sub.amount;
        annual += sub.amount * 12;
      } else {
        annual += sub.amount;
        monthly += sub.amount / 12;
      }
    });

    setTotalMonthly(monthly);
    setTotalAnnual(annual);
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setSubscriptions(subscriptions.filter(sub => sub.id !== deleteId));
      calculateTotals(subscriptions.filter(sub => sub.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  }

  useEffect(() => {
    loadSubscriptions();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Subscriptions" 
        rightAction={{
          icon: "plus",
          onPress: () => router.push('/(app)/subscriptions/add')
        }}
      />

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadSubscriptions}
            colors={[theme.colors.primary]} 
          />
        }
      >
        {subscriptions.length > 0 ? (
          <>
            <View style={styles.totalsContainer}>
              <SummaryCard
                title="Monthly Total"
                amount={totalMonthly}
                icon="calendar-month"
                subtitle={`${subscriptions.length} active subscriptions`}
              />
              <SummaryCard
                title="Annual Total"
                amount={totalAnnual}
                icon="calendar-year"
                subtitle="Projected yearly cost"
              />
            </View>

            <View style={styles.listContainer}>
              {subscriptions.map((subscription, index) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onPress={() => router.push(`/(app)/subscriptions/${subscription.id}`)}
                  onDelete={() => setDeleteId(subscription.id)}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="playlist-plus"
              size={64}
              color={theme.colors.primary}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              No subscriptions yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              Tap the + button to add your first subscription
            </Text>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={!!deleteId} onDismiss={() => setDeleteId(null)}>
          <Dialog.Title style={styles.dialogTitle}>Delete Subscription</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Are you sure you want to delete this subscription? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteId(null)}>Cancel</Button>
            <Button 
              onPress={handleDelete}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  totalsContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  listContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dialogText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
