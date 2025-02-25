import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Share } from 'react-native';
import { Text, List, Switch, Button, useTheme, RadioButton, Portal, Dialog, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from '../../../src/lib/supabase';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { useThemeContext } from '../../../src/contexts/ThemeContext';
import { format } from 'date-fns';

export default function Settings() {
  const router = useRouter();
  const theme = useTheme();
  const { themeType, setThemeType } = useThemeContext();
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/(auth)/sign-in');
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const exportData = {
        exportDate: new Date().toISOString(),
        subscriptions: subscriptions || [],
      };

      const fileName = `subscription-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
      const fileContent = JSON.stringify(exportData, null, 2);

      if (Platform.OS === 'web') {
        const blob = new Blob([fileContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, fileContent);
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Export Subscription Data',
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title="Settings" />
      
      <ScrollView style={styles.scrollView}>
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <List.Section>
            <List.Subheader style={{ color: theme.colors.primary }}>Appearance</List.Subheader>
            <List.Item
              title="Theme"
              titleStyle={{ color: theme.colors.onSurface }}
              description={themeType.charAt(0).toUpperCase() + themeType.slice(1)}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={props => <List.Icon {...props} icon="theme-light-dark" color={theme.colors.primary} />}
              onPress={() => setShowThemeDialog(true)}
              style={styles.listItem}
            />
          </List.Section>
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <List.Section>
            <List.Subheader style={{ color: theme.colors.primary }}>Notifications</List.Subheader>
            <List.Item
              title="Renewal Reminders"
              titleStyle={{ color: theme.colors.onSurface }}
              description="Get notified before subscriptions renew"
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={props => <List.Icon {...props} icon="bell" color={theme.colors.primary} />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
            <List.Item
              title="Budget Alerts"
              titleStyle={{ color: theme.colors.onSurface }}
              description="Get notified when approaching budget limits"
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={props => <List.Icon {...props} icon="cash-alert" color={theme.colors.primary} />}
              right={() => (
                <Switch
                  value={budgetAlertsEnabled}
                  onValueChange={setBudgetAlertsEnabled}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
          </List.Section>
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <List.Section>
            <List.Subheader style={{ color: theme.colors.primary }}>Data Management</List.Subheader>
            <List.Item
              title="Export Data"
              titleStyle={{ color: theme.colors.onSurface }}
              description="Download your subscription data"
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={props => <List.Icon {...props} icon="download" color={theme.colors.primary} />}
              onPress={handleExportData}
              style={styles.listItem}
            />
          </List.Section>
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <List.Section>
            <List.Subheader style={{ color: theme.colors.primary }}>Account</List.Subheader>
            <List.Item
              title="Sign Out"
              titleStyle={{ color: theme.colors.error }}
              left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
              onPress={handleSignOut}
              style={styles.listItem}
            />
          </List.Section>
        </Surface>
      </ScrollView>

      <Portal>
        <Dialog visible={showThemeDialog} onDismiss={() => setShowThemeDialog(false)}>
          <Dialog.Title style={{ color: theme.colors.onSurface }}>Choose Theme</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => {
              setThemeType(value as 'light' | 'dark' | 'system');
              setShowThemeDialog(false);
            }} value={themeType}>
              <RadioButton.Item
                label="Light"
                value="light"
                labelStyle={{ color: theme.colors.onSurface }}
                color={theme.colors.primary}
              />
              <RadioButton.Item
                label="Dark"
                value="dark"
                labelStyle={{ color: theme.colors.onSurface }}
                color={theme.colors.primary}
              />
              <RadioButton.Item
                label="System"
                value="system"
                labelStyle={{ color: theme.colors.onSurface }}
                color={theme.colors.primary}
              />
            </RadioButton.Group>
          </Dialog.Content>
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
    padding: 16,
  },
  section: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 8,
  },
});
