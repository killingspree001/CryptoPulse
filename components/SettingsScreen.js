import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Switch,
    ScrollView,
    Platform,
    StatusBar,
    Alert,
} from 'react-native';
import { Bell, Shield, Zap, Wallet, Info, AlertTriangle, ChevronRight, Clock, RefreshCw, Moon, Sun } from 'lucide-react-native';
import useSettingsStore, { getTheme } from '../store/useSettingsStore';

export default function SettingsScreen() {
    const darkMode = useSettingsStore((s) => s.darkMode);
    const toggleDarkMode = useSettingsStore((s) => s.toggleDarkMode);
    const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
    const toggleNotifications = useSettingsStore((s) => s.toggleNotifications);
    const whaleAlertsEnabled = useSettingsStore((s) => s.whaleAlertsEnabled);
    const toggleWhaleAlerts = useSettingsStore((s) => s.toggleWhaleAlerts);
    const btcAlertThreshold = useSettingsStore((s) => s.btcAlertThreshold);
    const setBtcAlertThreshold = useSettingsStore((s) => s.setBtcAlertThreshold);
    const refreshInterval = useSettingsStore((s) => s.refreshInterval);
    const setRefreshInterval = useSettingsStore((s) => s.setRefreshInterval);

    const t = getTheme(darkMode);

    const testNotification = () => {
        Alert.alert(
            '🔔 CryptoPulse Alert',
            `BTC has reached your threshold of $${Number(btcAlertThreshold).toLocaleString()}!\n\nThis is a demo alert — in production this would be a push notification.`,
            [{ text: 'Dismiss', style: 'cancel' }]
        );
    };

    const cycleRefreshInterval = () => {
        const options = [30, 60, 120, 300];
        const labels = ['30s', '1 min', '2 min', '5 min'];
        const current = options.indexOf(refreshInterval);
        const next = (current + 1) % options.length;
        setRefreshInterval(options[next]);
        Alert.alert('⏱ Auto-Refresh', `Market data will refresh every ${labels[next]}`);
    };

    const renderToggleRow = (icon, title, subtitle, value, onToggle) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: t.cardBorder }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{ width: 40, height: 40, backgroundColor: t.inputBg, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontWeight: '700', fontSize: 14 }}>{title}</Text>
                    <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 2 }}>{subtitle}</Text>
                </View>
            </View>
            <Switch value={value} onValueChange={onToggle} trackColor={{ false: darkMode ? '#374151' : '#D1D5DB', true: t.emerald }} thumbColor="#FFFFFF" />
        </View>
    );

    const renderActionRow = (icon, title, subtitle, rightText, onPress) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: t.cardBorder }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{ width: 40, height: 40, backgroundColor: t.inputBg, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontWeight: '700', fontSize: 14 }}>{title}</Text>
                    <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 2 }}>{subtitle}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {rightText && <Text style={{ color: t.emerald, fontSize: 12, fontWeight: '700', marginRight: 8 }}>{rightText}</Text>}
                <ChevronRight color={t.textDim} size={18} />
            </View>
        </TouchableOpacity>
    );

    const refreshLabels = { 30: '30s', 60: '1m', 120: '2m', 300: '5m' };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />
            <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
                <Text style={{ color: t.text, fontSize: 28, fontWeight: '800', marginBottom: 28, marginTop: 16 }}>Settings</Text>

                {/* Appearance */}
                <Text style={{ color: t.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                    Appearance
                </Text>
                <View style={{ backgroundColor: t.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: t.cardBorder, marginBottom: 28 }}>
                    {renderToggleRow(
                        darkMode ? <Moon color={t.purple} size={20} /> : <Sun color={t.gold} size={20} />,
                        'Dark Mode',
                        darkMode ? 'Obsidian theme active' : 'Light theme active',
                        darkMode,
                        toggleDarkMode
                    )}
                    {renderActionRow(
                        <Clock color={t.blue} size={20} />,
                        'Auto-Refresh',
                        'How often market data updates',
                        refreshLabels[refreshInterval] || '1m',
                        cycleRefreshInterval
                    )}
                </View>

                {/* Alert Preferences */}
                <Text style={{ color: t.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                    Alert Preferences
                </Text>
                <View style={{ backgroundColor: t.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: t.cardBorder, marginBottom: 28 }}>
                    {renderToggleRow(
                        <Bell color={t.emerald} size={20} />,
                        'Price Alerts',
                        notificationsEnabled ? 'Alerts active' : 'Alerts paused',
                        notificationsEnabled,
                        toggleNotifications
                    )}
                    {renderToggleRow(
                        <Shield color={t.gold} size={20} />,
                        'Whale Watch',
                        whaleAlertsEnabled ? 'Live tracking on' : 'Live tracking paused',
                        whaleAlertsEnabled,
                        toggleWhaleAlerts
                    )}

                    <View style={{ paddingTop: 16 }}>
                        <Text style={{ color: t.textSecondary, fontSize: 12, marginBottom: 8 }}>BTC Alert Threshold</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, backgroundColor: t.inputBg, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginRight: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: t.textMuted, marginRight: 4, fontSize: 16 }}>$</Text>
                                <TextInput
                                    style={{ color: t.text, fontWeight: '700', flex: 1, fontSize: 16 }}
                                    value={btcAlertThreshold}
                                    onChangeText={setBtcAlertThreshold}
                                    keyboardType="numeric"
                                    placeholderTextColor={t.textDim}
                                />
                            </View>
                            <TouchableOpacity
                                style={{ backgroundColor: t.emerald, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 }}
                                onPress={testNotification}
                                activeOpacity={0.8}
                            >
                                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>Test</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Account */}
                <Text style={{ color: t.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                    Account & Data
                </Text>
                <View style={{ backgroundColor: t.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: t.cardBorder, marginBottom: 28 }}>
                    {renderActionRow(<Wallet color={t.purple} size={20} />, 'Linked Wallets', 'View your on-chain assets', null, () =>
                        Alert.alert('🔗 Wallets', 'Wallet linking coming soon in v2.0!')
                    )}
                    {renderActionRow(<Info color={t.textSecondary} size={20} />, 'About CryptoPulse', 'Version 1.0.0', null, () =>
                        Alert.alert('CryptoPulse v1.0.0', 'Built with React Native & Expo.\n\nMarket Intelligence for everyone.')
                    )}
                </View>

                {/* Demo Mode Notice */}
                <View style={{
                    backgroundColor: `${t.gold}10`, padding: 16, borderRadius: 16,
                    borderWidth: 1, borderColor: `${t.gold}20`,
                    flexDirection: 'row', alignItems: 'flex-start',
                }}>
                    <AlertTriangle color={t.gold} size={18} style={{ marginRight: 12, marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: t.gold, fontWeight: '700', fontSize: 13 }}>Demo Mode</Text>
                        <Text style={{ color: t.textMuted, fontSize: 11, lineHeight: 18, marginTop: 4 }}>
                            Running with simulated data. Pull down on any screen to refresh with new values. All settings above are functional and affect the app in real-time.
                        </Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
