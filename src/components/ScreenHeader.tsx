import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
}

export function ScreenHeader({ title, showBack, rightAction }: ScreenHeaderProps) {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={{ height: insets.top }} />
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBack && (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => router.back()}
              iconColor={theme.colors.onSurface}
            />
          )}
          <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
        </View>
        {rightAction && (
          <IconButton
            icon={rightAction.icon}
            size={24}
            onPress={rightAction.onPress}
            iconColor={theme.colors.onSurface}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginLeft: 12,
  },
});
