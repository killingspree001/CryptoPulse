import { create } from 'zustand';

const useSettingsStore = create((set, get) => ({
    // Theme
    darkMode: true,

    // Alerts
    notificationsEnabled: true,
    whaleAlertsEnabled: true,
    btcAlertThreshold: '70000',

    // Refresh interval (seconds)
    refreshInterval: 60,

    // Actions
    toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
    toggleWhaleAlerts: () => set((s) => ({ whaleAlertsEnabled: !s.whaleAlertsEnabled })),
    setBtcAlertThreshold: (val) => set({ btcAlertThreshold: val }),
    setRefreshInterval: (val) => set({ refreshInterval: val }),
}));

// Theme colors based on mode
export const getTheme = (darkMode) =>
    darkMode
        ? {
            bg: '#0A0A0B',
            card: '#18181B',
            cardBorder: 'rgba(55,65,81,0.3)',
            text: '#FFFFFF',
            textSecondary: '#9CA3AF',
            textMuted: '#6B7280',
            textDim: '#4B5563',
            inputBg: '#111827',
            emerald: '#10B981',
            crimson: '#EF4444',
            gold: '#F59E0B',
            purple: '#8B5CF6',
            blue: '#3B82F6',
            statusBar: 'light',
        }
        : {
            bg: '#F9FAFB',
            card: '#FFFFFF',
            cardBorder: 'rgba(209,213,219,0.5)',
            text: '#111827',
            textSecondary: '#4B5563',
            textMuted: '#6B7280',
            textDim: '#9CA3AF',
            inputBg: '#F3F4F6',
            emerald: '#059669',
            crimson: '#DC2626',
            gold: '#D97706',
            purple: '#7C3AED',
            blue: '#2563EB',
            statusBar: 'dark',
        };

export default useSettingsStore;
