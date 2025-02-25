import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { addDays, format } from 'date-fns';
import { Subscription } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function scheduleRenewalNotification(subscription: Subscription) {
  const notificationDate = addDays(new Date(subscription.start_date), -3); // 3 days before renewal
  
  if (notificationDate <= new Date()) {
    return null; // Don't schedule if the date is in the past
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Subscription Renewal Reminder',
      body: `Your subscription to ${subscription.name} will renew on ${format(new Date(subscription.start_date), 'MMM dd, yyyy')}. Amount: $${subscription.amount}`,
      data: { subscriptionId: subscription.id },
    },
    trigger: {
      type: 'date',
      date: notificationDate,
    } as any,
  });

  return identifier;
}

export async function cancelNotification(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
