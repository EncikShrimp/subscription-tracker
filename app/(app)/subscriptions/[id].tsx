import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Menu } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../../src/lib/supabase';
import { LoadingScreen } from '../../../src/components/LoadingScreen';
import { Subscription, SubscriptionCategory } from '../../../src/types';
import { ScreenHeader } from '../../../src/components/ScreenHeader';

export default function EditSubscription() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'annually'>('monthly');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<SubscriptionCategory>('Other');
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: SubscriptionCategory[] = [
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
  ];

  useEffect(() => {
    loadSubscription();
  }, [id]);

  async function loadSubscription() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Subscription not found');

      setSubscription(data);
      setName(data.name);
      setAmount(data.amount.toString());
      setBillingFrequency(data.billing_frequency);
      setStartDate(new Date(data.start_date));
      setCategory(data.category || 'Other');
    } catch (error: any) {
      console.error('Error loading subscription:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!name || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('subscriptions')
        .update({
          name,
          amount: parseFloat(amount),
          billing_frequency: billingFrequency,
          start_date: startDate.toISOString(),
          category,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      router.replace('/(app)/subscriptions/');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!subscription) {
    return (
      <View style={styles.container}>
        <Text>Subscription not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Edit Subscription" 
        showBack={true}
      />
      
      <ScrollView style={styles.scrollView}>
        <TextInput
          label="Subscription Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Text variant="bodyMedium" style={styles.label}>Billing Frequency</Text>
        <SegmentedButtons
          value={billingFrequency}
          onValueChange={(value) => setBillingFrequency(value as 'monthly' | 'annually')}
          buttons={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'annually', label: 'Annually' },
          ]}
          style={styles.segment}
        />

        <Text variant="bodyMedium" style={styles.label}>Category</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.categoryButton}
            >
              {category}
            </Button>
          }
        >
          {categories.map((cat) => (
            <Menu.Item
              key={cat}
              onPress={() => {
                setCategory(cat);
                setMenuVisible(false);
              }}
              title={cat}
            />
          ))}
        </Menu>

        <Text variant="bodyMedium" style={styles.label}>Start Date</Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          {startDate.toLocaleDateString()}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={saving}
          style={styles.button}
        >
          Save Changes
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={[styles.button, styles.cancelButton]}
        >
          Cancel
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  segment: {
    marginBottom: 16,
  },
  categoryButton: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
  cancelButton: {
    marginTop: 12,
  },
  error: {
    color: '#B00020',
    marginBottom: 16,
  },
});
