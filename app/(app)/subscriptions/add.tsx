import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../../src/lib/supabase';
import { SubscriptionCategory } from '../../../src/types';
import {ScreenHeader} from '../../../src/components/ScreenHeader';

export default function AddSubscription() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'annually'>('monthly');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<SubscriptionCategory>('Other');
  const [menuVisible, setMenuVisible] = useState(false);
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

  async function handleSubmit() {
    if (!name || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error:', userError);
        throw new Error('Failed to get user: ' + userError.message);
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Creating subscription for user:', user.id);
      
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          name,
          amount: parseFloat(amount),
          billing_frequency: billingFrequency,
          start_date: startDate.toISOString(),
          category,
        });

      console.log('Insert error:', insertError);

      if (insertError) {
        console.error('Insert error details:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw insertError;
      }

      router.replace('/(app)/subscriptions/');
    } catch (e: any) {
      console.error('Full error:', e);
      setError(e.message || 'An unexpected error occurred');
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

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Add Subscription" 
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
          Add Subscription
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
