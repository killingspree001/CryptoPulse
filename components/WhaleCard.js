import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { getTheme } from '../store/useSettingsStore';

export default function WhaleCard({ whale, isNew, darkMode = true }) {
    const t = getTheme(darkMode);
    const scale = useRef(new Animated.Value(isNew ? 0.95 : 1)).current;
    const opacity = useRef(new Animated.Value(isNew ? 0 : 1)).current;

    useEffect(() => {
        if (isNew) {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(scale, { toValue: 1.02, duration: 200, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
                ]),
                Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]).start();
        }
    }, []);

    const isAlarm = whale.type === 'ALARM';
    const accentColor = isAlarm ? t.crimson : t.gold;

    return (
        <Animated.View
            style={{
                transform: [{ scale }],
                opacity,
                marginBottom: 14,
                padding: 16,
                borderRadius: 16,
                backgroundColor: t.card,
                borderLeftWidth: 4,
                borderLeftColor: accentColor,
                borderWidth: 1,
                borderColor: t.cardBorder,
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ color: t.text, fontSize: 17, fontWeight: '800' }}>{whale.quantity}</Text>
                    <Text style={{ color: t.textSecondary, fontSize: 14, fontWeight: '600', marginLeft: 6 }}>{whale.symbol}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: `${accentColor}25`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                        <Text style={{ color: accentColor, fontSize: 12, fontWeight: '800' }}>{whale.value}</Text>
                    </View>
                    {isAlarm && <AlertTriangle color={t.crimson} size={16} style={{ marginLeft: 8 }} />}
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: t.textSecondary, fontSize: 12 }}>{whale.from}</Text>
                <Text style={{ color: t.emerald, fontSize: 12, marginHorizontal: 8, fontWeight: '700' }}>→</Text>
                <Text style={{ color: t.textSecondary, fontSize: 12 }}>{whale.to}</Text>
            </View>

            <Text style={{ color: t.textDim, fontSize: 10, marginTop: 8 }}>{whale.time}</Text>
        </Animated.View>
    );
}
