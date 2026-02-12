import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    RefreshControl,
    Platform,
    StatusBar,
    Alert,
} from 'react-native';
import { getMockWhales, generateMockWhale } from '../services/mockData';
import useWhaleStore from '../store/useWhaleStore';
import useSettingsStore, { getTheme } from '../store/useSettingsStore';
import WhaleCard from './WhaleCard';

export default function WhaleTrackerScreen() {
    const darkMode = useSettingsStore((s) => s.darkMode);
    const whaleAlertsEnabled = useSettingsStore((s) => s.whaleAlertsEnabled);
    const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
    const btcThreshold = useSettingsStore((s) => s.btcAlertThreshold);
    const t = getTheme(darkMode);

    const whales = useWhaleStore((s) => s.whales);
    const setWhales = useWhaleStore((s) => s.setWhales);
    const addWhale = useWhaleStore((s) => s.addWhale);
    const [refreshing, setRefreshing] = useState(false);
    const intervalRef = useRef(null);

    // Initial load
    useEffect(() => {
        setWhales(getMockWhales(8));
    }, []);

    // Auto-generate new whales (respects whaleAlertsEnabled)
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (whaleAlertsEnabled) {
            intervalRef.current = setInterval(() => {
                const newWhale = generateMockWhale(true);
                addWhale(newWhale);

                // Trigger alert if notifications are on and it's an ALARM whale
                if (notificationsEnabled && newWhale.type === 'ALARM') {
                    Alert.alert(
                        '🐋 Whale Alert!',
                        `${newWhale.quantity} ${newWhale.symbol} moved (${newWhale.value})\n${newWhale.from} → ${newWhale.to}`,
                        [{ text: 'OK' }]
                    );
                }
            }, 10000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [whaleAlertsEnabled, notificationsEnabled]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await new Promise((r) => setTimeout(r, 600));
        setWhales(getMockWhales(8));
        setRefreshing(false);
    }, [setWhales]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />

            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 22, marginRight: 8 }}>🐋</Text>
                            <Text style={{ color: t.text, fontSize: 22, fontWeight: '800' }}>Whale Tracker</Text>
                        </View>
                        <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 2 }}>On-chain Intelligence</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: whaleAlertsEnabled ? t.emerald : t.textDim, marginRight: 6 }} />
                        <Text style={{ color: t.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
                            {whaleAlertsEnabled ? 'Live Feed' : 'Paused'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Whale List */}
            <FlatList
                data={whales}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <WhaleCard whale={item} isNew={index === 0} darkMode={darkMode} />}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.emerald} colors={[t.emerald]} progressBackgroundColor={t.card} />}
                ListEmptyComponent={
                    <View style={{ marginTop: 80, alignItems: 'center' }}>
                        <Text style={{ color: t.textDim }}>Watching for whale movements...</Text>
                    </View>
                }
            />

            {/* Insight Banner */}
            {whales.length > 0 && (
                <View style={{
                    position: 'absolute', bottom: 90, left: 20, right: 20,
                    backgroundColor: `${t.blue}14`, padding: 14, borderRadius: 16,
                    borderWidth: 1, borderColor: `${t.blue}25`,
                }}>
                    <Text style={{ color: darkMode ? '#93C5FD' : '#2563EB', fontSize: 11, lineHeight: 18 }}>
                        💡 <Text style={{ fontWeight: '700' }}>Insight:</Text> Large movements to exchanges often precede sell-offs. Watch for BTC inflow spikes.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}
