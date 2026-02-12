const CQ_API_URL = 'https://api.cryptoquant.com/v1';
const API_KEY = process.env.EXPO_PUBLIC_CRYPTOQUANT_API_KEY;

export const getExchangeFlows = async (symbol = 'btc', window = 'day') => {
    if (!API_KEY) return null;

    try {
        const response = await fetch(`${CQ_API_URL}/btc/exchange-flows/all_exchange/inflow-outflow?window=${window}&limit=10`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        const data = await response.json();
        // Transform CryptoQuant data for our chart
        return data.result.data.reverse().map(item => ({
            inflow: item.inflow,
            outflow: item.outflow,
            timestamp: item.timestamp
        }));
    } catch (error) {
        console.error('CryptoQuant API Error:', error);
        return null;
    }
};
