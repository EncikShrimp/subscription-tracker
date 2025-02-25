import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFadeIn } from '../utils/animations';
import Color from 'color';

interface Props {
  title: string;
  amount: number;
  icon: string;
  subtitle?: string;
  index?: number;
  trend?: number;
}

export function SummaryCard({ title, amount, icon, subtitle, index = 0, trend }: Props) {
  const theme = useTheme();
  const fadeAnim = useFadeIn(index * 150);

  const getTrendColor = () => {
    if (!trend) return theme.colors.onSurfaceVariant;
    return trend > 0 ? '#4CAF50' : '#F44336';
  };

  const getBackgroundWithOpacity = (color: string) => {
    return Color(color).alpha(0.15).rgb().string();
  };

  return (
    <Animated.View style={[styles.container, fadeAnim]}>
      <View style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceVariant,
        }
      ]}>
        <View style={styles.headerRow}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: getBackgroundWithOpacity(theme.colors.primary) }
          ]}>
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <Text 
            style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.amountRow}>
            <Text 
              style={[styles.amount, { color: theme.colors.onSurface }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              ${amount.toFixed(2)}
            </Text>
            {trend !== undefined && (
              <View style={[styles.trendContainer, { backgroundColor: getBackgroundWithOpacity(getTrendColor()) }]}>
                <MaterialCommunityIcons
                  name={trend > 0 ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={getTrendColor()}
                />
                <Text style={[styles.trendText, { color: getTrendColor() }]}>
                  {Math.abs(trend)}%
                </Text>
              </View>
            )}
          </View>
          
          {subtitle && (
            <Text 
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
    minWidth: '48%',
  },
  card: {
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  contentContainer: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
});
