import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
    Platform,
    StatusBar,
} from 'react-native';
import { getMockPrices, getMockTrending, getMockExchangeFlows } from '../services/mockData';
import SkeletonLoader from './SkeletonLoader';
import { ArrowDownCircle, ArrowUpCircle, Waves } from 'lucide-react-native';
import useSettingsStore, { getTheme } from '../store/useSettingsStore';

const TOP_COINS = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '◆' },
];

const SYMBOL_COLORS = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    SOL: '#9945FF',
    BNB: '#F3BA2F',
};

export default function MarketScreen() {
    const darkMode = useSettingsStore((s) => s.darkMode);
    const refreshInterval = useSettingsStore((s) => s.refreshInterval);
    const t = getTheme(darkMode);

    const [trending, setTrending] = useState([]);
    const [prices, setPrices] = useState({});
    const [exchangeFlows, setExchangeFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState('');

    const fetchData = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        await new Promise((r) => setTimeout(r, isRefresh ? 600 : 1200));

        setPrices(getMockPrices());
        setTrending(getMockTrending());
        setExchangeFlows(getMockExchangeFlows());
        setLastUpdate(new Date().toLocaleTimeString());

        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(true), refreshInterval * 1000);
        return () => clearInterval(interval);
    }, [fetchData, refreshInterval]);

    const onRefresh = useCallback(() => fetchData(true), [fetchData]);

    const renderTopCard = (coin) => {
        const data = prices[coin.id] || {};
        const change = data.usd_24h_change || 0;
        const isPositive = change >= 0;
        const color = SYMBOL_COLORS[coin.symbol] || t.emerald;

        return (
            <View
                key={coin.id}
                style={{
                    width: '48%',
                    marginBottom: 16,
                    padding: 16,
                    borderRadius: 24,
                    backgroundColor: t.card,
                    borderWidth: 1,
                    borderColor: isPositive ? `${t.emerald}25` : `${t.crimson}25`,
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: `${color}20`, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: color, fontSize: 18, fontWeight: 'bold' }}>{coin.icon}</Text>
                    </View>
                    <View style={{ backgroundColor: isPositive ? `${t.emerald}1F` : `${t.crimson}1F`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                        <Text style={{ color: isPositive ? t.emerald : t.crimson, fontSize: 11, fontWeight: '700' }}>
                            {isPositive ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
                        </Text>
                    </View>
                </View>
                <Text style={{ color: t.text, fontSize: 20, fontWeight: '800', marginBottom: 2 }}>
                    ${data.usd?.toLocaleString() || '---'}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <Text style={{ color: t.textMuted, fontSize: 11 }}>{coin.name}</Text>
                    <Text style={{ color: t.textDim, fontSize: 10 }}>Vol ${data.usd_24h_vol?.toFixed(1)}B</Text>
                </View>
            </View>
        );
    };

    const maxFlow = exchangeFlows.length > 0 ? Math.max(...exchangeFlows.map((f) => Math.max(f.inflow, f.outflow))) : 1;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />
            <ScrollView
                style={{ paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.emerald} colors={[t.emerald]} progressBackgroundColor={t.card} />}
            >
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, marginTop: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 42, height: 42, backgroundColor: t.gold, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                            <Waves color={darkMode ? '#0A0A0B' : '#FFFFFF'} size={22} />
                        </View>
                        <View>
                            <Text style={{ color: t.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }}>
                                Crypto<Text style={{ color: t.gold }}>Pulse</Text>
                            </Text>
                            <Text style={{ color: t.textMuted, fontSize: 11 }}>Market Intelligence</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: darkMode ? 'rgba(55,65,81,0.4)' : 'rgba(209,213,219,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: t.emerald, marginRight: 8 }} />
                        <Text style={{ color: t.text, fontSize: 11, fontWeight: '700' }}>
                            BTC ${prices.bitcoin?.usd?.toLocaleString() || '---'}
                        </Text>
                    </View>
                </View>

                {/* Top Assets Grid */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {loading
                        ? Array(4).fill(0).map((_, i) => <SkeletonLoader key={i} style={{ width: '48%', height: 130, borderRadius: 24, marginBottom: 16 }} />)
                        : TOP_COINS.map((coin) => renderTopCard(coin))}
                </View>

                {/* Trending Section */}
                <View style={{ marginTop: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, marginRight: 8 }}>🔥</Text>
                        <Text style={{ color: t.text, fontSize: 20, fontWeight: '800' }}>Trending Now</Text>
                    </View>
                    <Text style={{ color: t.textMuted, fontSize: 11 }}>Updated {lastUpdate}</Text>
                </View>

                <View style={{ backgroundColor: t.card, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: t.cardBorder }}>
                    {loading
                        ? Array(5).fill(0).map((_, i) => <SkeletonLoader key={i} style={{ width: '100%', height: 48, borderRadius: 12, marginBottom: 12 }} />)
                        : trending.map((coin, index) => {
                            const isPositive = coin.change24h >= 0;
                            return (
                                <TouchableOpacity
                                    key={coin.id}
                                    style={{
                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                        paddingVertical: 12,
                                        borderBottomWidth: index < trending.length - 1 ? 1 : 0,
                                        borderBottomColor: t.cardBorder,
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: t.textDim, fontSize: 11, fontWeight: '700', width: 28 }}>#{index + 1}</Text>
                                        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: darkMode ? '#1F2937' : '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                            <Text style={{ fontSize: 16 }}>{coin.icon}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: t.text, fontWeight: '700', fontSize: 14 }}>{coin.name}</Text>
                                            <Text style={{ color: t.textMuted, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>{coin.symbol}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ color: isPositive ? t.emerald : t.crimson, fontSize: 12, fontWeight: '700' }}>
                                        {isPositive ? '↗' : '↘'} {isPositive ? '+' : ''}{coin.change24h}%
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                </View>

                {/* Exchange Flow Chart */}
                <View style={{ marginTop: 32, marginBottom: 100 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <View>
                            <Text style={{ color: t.text, fontSize: 20, fontWeight: '800' }}>Exchange Flow</Text>
                            <Text style={{ color: t.textMuted, fontSize: 11, marginTop: 4 }}>BTC Inflow vs Outflow (24h)</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                                <ArrowDownCircle color={t.crimson} size={14} />
                                <Text style={{ color: t.crimson, fontSize: 11, marginLeft: 4, fontWeight: '700' }}>Inflow</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ArrowUpCircle color={t.emerald} size={14} />
                                <Text style={{ color: t.emerald, fontSize: 11, marginLeft: 4, fontWeight: '700' }}>Outflow</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ backgroundColor: t.card, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: t.cardBorder, height: 180, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                        {exchangeFlows.map((flow, i) => {
                            const inflowH = (flow.inflow / maxFlow) * 100;
                            const outflowH = (flow.outflow / maxFlow) * 100;
                            return (
                                <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120 }}>
                                        <View style={{ width: 6, backgroundColor: t.crimson, borderRadius: 3, height: inflowH, marginRight: 2, opacity: 0.6 }} />
                                        <View style={{ width: 6, backgroundColor: t.emerald, borderRadius: 3, height: outflowH }} />
                                    </View>
                                    <Text style={{ color: t.textDim, fontSize: 8, marginTop: 6 }}>{flow.label}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
