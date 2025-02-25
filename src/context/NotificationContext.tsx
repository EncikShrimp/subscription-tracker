import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../services/notifications';

interface NotificationContextType {
  pushToken: string | null;
  notificationsEnabled: boolean;
  requestPermissions: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  pushToken: null,
  notificationsEnabled: false,
  requestPermissions: async () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [pushToken, setPushToken] = useState<string | null>(null);

  async function requestPermissions() {
    const token = await registerForPushNotificationsAsync();
    setPushToken(token);
  }

  useEffect(() => {
    requestPermissions();
  }, []);

  const value = {
    pushToken,
    notificationsEnabled: !!pushToken,
    requestPermissions,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
