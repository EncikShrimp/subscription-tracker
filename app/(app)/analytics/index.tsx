// import React, { useEffect, useState } from 'react';
// import { View, ScrollView, Dimensions, StyleSheet, Pressable } from 'react-native';
// import { Text, useTheme, Surface, SegmentedButtons } from 'react-native-paper';
// import { LineChart, PieChart } from 'react-native-chart-kit';
// import { supabase } from '../../../src/lib/supabase';
// import { LoadingScreen } from '../../../src/components/LoadingScreen';
// import { Subscription } from '../../../src/types';
// import { ScreenHeader } from '../../../src/components/ScreenHeader';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {
//   calculateMonthlySpending,
//   calculateCategorySpending,
//   calculateTotalSpending,
//   formatCurrency,
//   MonthlySpending,
//   CategorySpending,
// } from '../../../src/utils/analytics';

// const screenWidth = Dimensions.get('window').width;

// type TimeRange = '3m' | '6m' | '1y';

// export default function AnalyticsScreen() {
//   const theme = useTheme();
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [monthlyData, setMonthlyData] = useState<MonthlySpending[]>([]);
//   const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
//   const [totalMonthly, setTotalMonthly] = useState(0);
//   const [timeRange, setTimeRange] = useState<TimeRange>('3m');

//   useEffect(() => {
//     loadSubscriptions();
//   }, []);

//   async function loadSubscriptions() {
//     try {
//       const { data: subs, error } = await supabase
//         .from('subscriptions')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       setSubscriptions(subs || []);
//       updateAnalytics(subs || [], timeRange);
//     } catch (error) {
//       console.error('Error loading subscriptions:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const updateAnalytics = (subs: Subscription[], range: TimeRange) => {
//     const monthsToShow = range === '3m' ? 3 : range === '6m' ? 6 : 12;
//     const monthly = calculateMonthlySpending(subs).slice(0, monthsToShow);
//     const categories = calculateCategorySpending(subs);
//     const total = calculateTotalSpending(subs);

//     setMonthlyData(monthly);
//     setCategoryData(categories);
//     setTotalMonthly(total);
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   const chartConfig = {
//     backgroundColor: 'transparent',
//     backgroundGradientFrom: theme.colors.surface,
//     backgroundGradientTo: theme.colors.surface,
//     decimalPlaces: 0,
//     color: (opacity = 1) => theme.colors.primary,
//     labelColor: (opacity = 1) => theme.colors.onSurface,
//     style: {
//       borderRadius: 16,
//     },
//     propsForDots: {
//       r: '6',
//       strokeWidth: '2',
//       stroke: theme.colors.primary,
//     },
//     propsForLabels: {
//       fontSize: 12,
//     },
//   };

//   const pieChartData = categoryData.map((item, index) => ({
//     name: item.category,
//     amount: item.amount,
//     color: `hsl(${index * (360 / categoryData.length)}, 70%, 50%)`,
//     legendFontColor: theme.colors.onSurface,
//     legendFontSize: 12,
//   }));

//   const renderTrendIndicator = () => {
//     if (monthlyData.length < 2) return null;
//     const currentMonth = monthlyData[0].amount;
//     const previousMonth = monthlyData[1].amount;
//     const percentageChange = ((currentMonth - previousMonth) / previousMonth) * 100;
//     const isPositive = percentageChange > 0;

//     return (
//       <View style={styles.trendContainer}>
//         <MaterialCommunityIcons
//           name={isPositive ? 'trending-up' : 'trending-down'}
//           size={20}
//           color={isPositive ? '#f44336' : '#4caf50'}
//         />
//         <Text style={[styles.trendText, { color: isPositive ? '#f44336' : '#4caf50' }]}>
//           {Math.abs(percentageChange).toFixed(1)}% from last month
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <ScreenHeader title="Analytics" />
//       <ScrollView style={styles.scrollView}>
//         {/* Monthly Overview Card */}
//         <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={1}>
//           <View style={styles.overviewHeader}>
//             <MaterialCommunityIcons name="currency-usd" size={24} color={theme.colors.primary} />
//             <Text variant="titleMedium" style={[styles.overviewTitle, { color: theme.colors.onSurface }]}>
//               Monthly Overview
//             </Text>
//           </View>
//           <Text variant="displaySmall" style={[styles.amount, { color: theme.colors.primary }]}>
//             {formatCurrency(totalMonthly)}
//           </Text>
//           <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
//             Total Monthly Spending
//           </Text>
//           {renderTrendIndicator()}
//         </Surface>

//         {/* Spending Trend Chart */}
//         <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={1}>
//           <View style={styles.chartHeader}>
//             <View style={styles.chartTitleContainer}>
//               <MaterialCommunityIcons name="chart-line" size={24} color={theme.colors.primary} />
//               <Text variant="titleMedium" style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
//                 Spending Trend
//               </Text>
//             </View>
//             <SegmentedButtons
//               value={timeRange}
//               onValueChange={value => {
//                 setTimeRange(value as TimeRange);
//                 updateAnalytics(subscriptions, value as TimeRange);
//               }}
//               buttons={[
//                 { value: '3m', label: '3M' },
//                 { value: '6m', label: '6M' },
//                 { value: '1y', label: '1Y' },
//               ]}
//               style={styles.segmentedButtons}
//             />
//           </View>
//           <View style={styles.chartContainer}>
//             <LineChart
//               data={{
//                 labels: monthlyData.map(d => d.month),
//                 datasets: [{
//                   data: monthlyData.map(d => d.amount)
//                 }]
//               }}
//               width={screenWidth - 48}
//               height={220}
//               chartConfig={chartConfig}
//               bezier
//               style={styles.chart}
//             />
//           </View>
//         </Surface>

//         {/* Category Distribution Chart */}
//         <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={1}>
//           <View style={styles.chartHeader}>
//             <MaterialCommunityIcons name="chart-pie" size={24} color={theme.colors.primary} />
//             <Text variant="titleMedium" style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
//               Category Distribution
//             </Text>
//           </View>
//           {categoryData.length > 0 ? (
//             <>
//               <View style={styles.chartContainer}>
//                 <PieChart
//                   data={pieChartData}
//                   width={screenWidth - 48}
//                   height={220}
//                   chartConfig={chartConfig}
//                   accessor="amount"
//                   backgroundColor="transparent"
//                   paddingLeft="15"
//                   absolute
//                 />
//               </View>
//               <View style={styles.categoryList}>
//                 {categoryData.map((category, index) => (
//                   <View key={category.category} style={styles.categoryItem}>
//                     <View style={styles.categoryLeft}>
//                       <View 
//                         style={[
//                           styles.categoryDot, 
//                           { backgroundColor: pieChartData[index].color }
//                         ]} 
//                       />
//                       <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
//                         {category.category}
//                       </Text>
//                     </View>
//                     <View style={styles.categoryRight}>
//                       <Text style={[styles.categoryAmount, { color: theme.colors.onSurface }]}>
//                         {formatCurrency(category.amount)}
//                       </Text>
//                       <Text style={[styles.categoryPercentage, { color: theme.colors.onSurfaceVariant }]}>
//                         {category.percentage.toFixed(1)}%
//                       </Text>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             </>
//           ) : (
//             <Text style={[styles.noDataText, { color: theme.colors.onSurfaceVariant }]}>
//               No category data available
//             </Text>
//           )}
//         </Surface>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//     padding: 16,
//   },
//   surface: {
//     borderRadius: 16,
//     marginBottom: 16,
//     padding: 16,
//   },
//   overviewHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   overviewTitle: {
//     marginLeft: 8,
//   },
//   amount: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//   },
//   trendContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   trendText: {
//     marginLeft: 4,
//     fontSize: 14,
//   },
//   chartHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     justifyContent: 'space-between',
//   },
//   chartTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   chartTitle: {
//     marginLeft: 8,
//   },
//   segmentedButtons: {
//     maxWidth: 200,
//   },
//   chartContainer: {
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   categoryList: {
//     marginTop: 16,
//   },
//   categoryItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   categoryLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   categoryDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   categoryName: {
//     fontSize: 14,
//   },
//   categoryRight: {
//     alignItems: 'flex-end',
//   },
//   categoryAmount: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   categoryPercentage: {
//     fontSize: 12,
//     marginTop: 2,
//   },
//   noDataText: {
//     textAlign: 'center',
//     marginVertical: 16,
//     fontStyle: 'italic',
//   },
// });
