import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Home, Zap, Settings } from 'lucide-react-native';
import MarketScreen from '../components/MarketScreen';
import WhaleTrackerScreen from '../components/WhaleTrackerScreen';
import SettingsScreen from '../components/SettingsScreen';
import useSettingsStore, { getTheme } from '../store/useSettingsStore';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const darkMode = useSettingsStore((s) => s.darkMode);
    const t = getTheme(darkMode);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: t.bg,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 88 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: t.emerald,
                tabBarInactiveTintColor: t.textDim,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    marginTop: 2,
                },
                tabBarIcon: ({ color }) => {
                    const iconSize = 22;
                    if (route.name === 'Market') return <Home color={color} size={iconSize} />;
                    if (route.name === 'Whale Alerts') return <Zap color={color} size={iconSize} />;
                    if (route.name === 'Settings') return <Settings color={color} size={iconSize} />;
                },
            })}
        >
            <Tab.Screen name="Market" component={MarketScreen} />
            <Tab.Screen name="Whale Alerts" component={WhaleTrackerScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}
