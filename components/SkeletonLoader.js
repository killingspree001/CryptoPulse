import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export default function SkeletonLoader({ style }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: '#1F2937',
                    borderRadius: 12,
                },
                style,
                { opacity },
            ]}
        />
    );
}
