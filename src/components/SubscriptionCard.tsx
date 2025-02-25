import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { Subscription } from '../types';
import { useScale, useSlideIn } from '../utils/animations';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from 'color';

interface Props {
  subscription: Subscription;
  onPress?: () => void;
  onDelete: (id: string) => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


export function SubscriptionCard({ subscription, onPress, onDelete, index = 0 }: Props) {
  const theme = useTheme();
  const { scale, onPressIn, onPressOut, transform } = useScale();
  const slideAnim = useSlideIn(index * 100);

  const getBackgroundWithOpacity = (color: string) => {
    return Color(color).alpha(0.15).rgb().string();
  };

  // Memoize styles that depend on theme to prevent unnecessary re-renders
  const themedStyles = useMemo(() => ({
    card: {
      backgroundColor: theme.colors.surface,
    },
    categoryContainer: {
      backgroundColor: getBackgroundWithOpacity(theme.colors.primary),
    },
    title: {
      color: theme.colors.onSurface,
    },
    amount: {
      color: theme.colors.primary,
    },
    frequency: {
      color: theme.colors.onSurfaceVariant,
    },
    category: {
      color: theme.colors.primary,
    },
    detail: {
      color: theme.colors.onSurfaceVariant,
    },
  }), [theme.colors]);

  return (
    <Animated.View style={[styles.animatedContainer, slideAnim]}>
      <Card style={[styles.card, themedStyles.card]}>
        <AnimatedPressable 
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={({ pressed }) => [
            styles.pressable,
            {
              backgroundColor: pressed 
                ? theme.colors.surfaceVariant 
                : theme.colors.surface,
              transform: [{ scale: scale }],
            },
          ]}
        >
          <Card.Content style={styles.content}>
            <View style={styles.header}>
              <View style={styles.leftContent}>
                <Text 
                  style={[styles.titleText, themedStyles.title]}
                  numberOfLines={1}
                >
                  {subscription.name}
                </Text>
                <View style={[styles.categoryContainer, themedStyles.categoryContainer]}>
                  <Text style={[styles.categoryText, themedStyles.category]}>
                    {subscription.category}
                  </Text>
                </View>
              </View>
              <Text style={[styles.amountText, themedStyles.amount]}>
                ${subscription.amount}
                <Text style={[styles.frequencyText, themedStyles.frequency]}>
                  /{subscription.billing_frequency}
                </Text>
              </Text>
            </View>
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                  style={styles.detailIcon}
                />
                <Text style={[styles.detailText, themedStyles.detail]}>
                  Next payment: {format(new Date(subscription.start_date), 'MMM dd, yyyy')}
                </Text>
              </View>
            </View>
          </Card.Content>
        </AnimatedPressable>
        <Card.Actions style={styles.actions}>
          <IconButton
            icon="pencil"
            onPress={onPress}
            iconColor={theme.colors.primary}
            size={20}
          />
          <IconButton
            icon="delete"
            onPress={() => onDelete(subscription.id)}
            iconColor={theme.colors.error}
            size={20}
          />
        </Card.Actions>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  pressable: {
    borderRadius: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  details: {
    flexDirection: 'column',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
  },
  categoryContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    justifyContent: 'flex-end',
    paddingTop: 0,
    paddingRight: 8,
    paddingBottom: 8,
  },
});
