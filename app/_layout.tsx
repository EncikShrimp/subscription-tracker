import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeContext } from '../src/contexts/ThemeContext';
import { theme } from '../src/theme';
import { NotificationProvider } from '../src/context/NotificationContext';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

function RootLayoutNav() {
  const { theme, isDarkTheme } = useThemeContext();

  return (
    <PaperProvider theme={theme}>
      <NotificationProvider>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <StatusBar 
            style={isDarkTheme ? "light" : "dark"}
            backgroundColor="transparent"
            translucent={true}
          />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: 'Home',
              }}
            />
            <Stack.Screen
              name="(auth)/sign-in"
              options={{
                title: 'Sign In',
              }}
            />
            <Stack.Screen
              name="(auth)/sign-up"
              options={{
                title: 'Sign Up',
              }}
            />
            <Stack.Screen
              name="(app)/subscriptions/index"
              options={{
                title: 'My Subscriptions',
              }}
            />
            <Stack.Screen
              name="(app)/subscriptions/add"
              options={{
                title: 'Add Subscription',
              }}
            />
            <Stack.Screen
              name="(app)/subscriptions/[id]"
              options={{
                title: 'Edit Subscription',
              }}
            />
            <Stack.Screen
              name="(app)/profile/index"
              options={{
                title: 'Profile',
              }}
            />
          </Stack>
        </View>
      </NotificationProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
