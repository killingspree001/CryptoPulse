const WHALE_ALERT_API_URL = 'https://api.whale-alert.io/v1';
const API_KEY = process.env.EXPO_PUBLIC_WHALE_ALERT_API_KEY;

export const getWhaleTransactions = async (min_value = 500000) => {
    if (!API_KEY) return [];

    try {
        // Get transactions from the last hour
        const start = Math.floor(Date.now() / 1000) - 3600;
        const response = await fetch(`${WHALE_ALERT_API_URL}/transactions?api_key=${API_KEY}&min_value=${min_value}&start=${start}`);
        const data = await response.json();

        if (data.result === 'success') {
            return data.transactions.map(tx => ({
                id: tx.hash,
                symbol: tx.symbol.toUpperCase(),
                price: '---', // Whale Alert doesn't provide price per unit in this endpoint
                quantity: tx.amount.toLocaleString(),
                volume: tx.amount_usd.toLocaleString(),
                value: (tx.amount_usd / 1000000).toFixed(1) + 'M',
                time: new Date(tx.timestamp * 1000).toLocaleTimeString(),
                timestamp: tx.timestamp * 1000,
                type: tx.amount_usd >= 1000000 ? 'ALARM' : 'NORMAL',
                from: tx.from.owner_type || 'Unknown Wallet',
                to: tx.to.owner_type || 'Unknown Wallet'
            }));
        }
        return [];
    } catch (error) {
        console.error('Whale Alert API Error:', error);
        return [];
    }
};
