const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.EXPO_PUBLIC_COINGECKO_API_KEY;

const getHeaders = () => {
    const headers = { 'accept': 'application/json' };
    if (API_KEY) {
        headers['x-cg-demo-api-key'] = API_KEY;
    }
    return headers;
};

export const getTrendingCoins = async () => {
    try {
        const response = await fetch(`${BASE_URL}/search/trending`, { headers: getHeaders() });
        const data = await response.json();
        return data.coins.map(item => ({
            id: item.item.id,
            name: item.item.name,
            symbol: item.item.symbol,
            thumb: item.item.large,
            market_cap_rank: item.item.market_cap_rank,
            price_btc: item.item.price_btc.toFixed(8),
            data: item.item.data
        }));
    } catch (error) {
        console.error('CoinGecko API Error:', error);
        return [];
    }
};

export const getCoinPrices = async (ids) => {
    try {
        const response = await fetch(`${BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        console.error('CoinGecko Price Error:', error);
        return {};
    }
};
