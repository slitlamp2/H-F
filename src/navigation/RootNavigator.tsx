import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SettingsHeaderButton from '../components/SettingsHeaderButton';
import { useProfile } from '../context/ProfileContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import GenderSetupScreen from '../screens/GenderSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import TimelineScreen from '../screens/TimelineScreen';
import RoutineScreen from '../screens/RoutineScreen';
import CalendarScreen from '../screens/CalendarScreen';
import RecommendScreen from '../screens/RecommendScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors } from '../theme';
import type { MainTabParamList, RootStackParamList } from './types';

export type { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Home: '🏠',
  Timeline: '📷',
  Routine: '✅',
  Calendar: '📅',
  Recommend: '💡',
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  Home: '홈',
  Timeline: '기록',
  Routine: '루틴',
  Calendar: '달력',
  Recommend: '추천',
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDF0F4',
    paddingTop: 8,
    paddingHorizontal: 4,
    shadowColor: '#1A1D21',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -1 },
    elevation: 8,
  },
  tabItem: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabIconActive: {
    transform: [{ scale: 1.06 }],
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  headerLeft: {
    paddingHorizontal: 12,
  },
  headerRight: {
    paddingRight: 16,
    paddingLeft: 4,
  },
  headerTitle: {
    maxWidth: 140,
    alignItems: 'center',
  },
});

function MainTabs() {
  const insets = useSafeAreaInsets();
  /** 3버튼 내비 등에서 inset이 0이어도 라벨이 잘리지 않게 최소 여백을 둔다. */
  const androidBottom = Math.max(insets.bottom, 16);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const name = route.name as keyof MainTabParamList;
        return {
          title: TAB_LABELS[name],
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: '700', color: colors.text },
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerLeftContainerStyle: styles.headerLeft,
          headerRightContainerStyle: styles.headerRight,
          headerTitleContainerStyle: styles.headerTitle,
          headerRight: () => <SettingsHeaderButton />,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#8A93A3',
          tabBarStyle: [
            styles.tabBar,
            Platform.OS === 'android' && {
              paddingBottom: androidBottom,
              height: 56 + androidBottom,
            },
          ],
          tabBarItemStyle: styles.tabItem,
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
              {TAB_ICONS[name]}
            </Text>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color, fontWeight: focused ? '800' : '700' },
              ]}
              numberOfLines={1}
            >
              {TAB_LABELS[name]}
            </Text>
          ),
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
      <Tab.Screen name="Routine" component={RoutineScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Recommend" component={RecommendScreen} />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: '사용 설정', headerBackTitle: '뒤로' }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { profile } = useProfile();
  return (
    <NavigationContainer>
      {!profile ? (
        <OnboardingScreen />
      ) : !profile.gender ? (
        <GenderSetupScreen />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
}
