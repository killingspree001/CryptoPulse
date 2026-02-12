// ============================================
// CryptoPulse — Demo Data Engine
// Generates realistic, randomized crypto data
// that changes on every reload / pull-to-refresh
// ============================================

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));
const pick = (arr) => arr[randInt(0, arr.length)];

// ---- Top Asset Prices ----
const BASE_PRICES = {
    bitcoin: { base: 67000, swing: 4000, vol: 42 },
    ethereum: { base: 2500, swing: 300, vol: 18 },
    solana: { base: 148, swing: 20, vol: 3.2 },
    binancecoin: { base: 584, swing: 40, vol: 1.8 },
};

export const getMockPrices = () => {
    const result = {};
    Object.entries(BASE_PRICES).forEach(([id, { base, swing, vol }]) => {
        const price = +(base + rand(-swing, swing)).toFixed(2);
        const change = +rand(-8, 12).toFixed(1);
        const volume = +(vol + rand(-vol * 0.3, vol * 0.3)).toFixed(1);
        result[id] = {
            usd: price,
            usd_24h_change: change,
            usd_24h_vol: volume,
        };
    });
    return result;
};

// ---- Trending Coins ----
const TRENDING_POOL = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎' },
    { id: 'pepe', name: 'Pepe', symbol: 'PEPE', icon: '🐸' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', icon: 'Ð' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', icon: '⬡' },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', icon: 'A' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: '₳' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', icon: '●' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', icon: '✕' },
    { id: 'sui', name: 'Sui', symbol: 'SUI', icon: '💧' },
    { id: 'render-token', name: 'Render', symbol: 'RNDR', icon: 'R' },
];

export const getMockTrending = () => {
    // Shuffle and pick 6
    const shuffled = [...TRENDING_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6).map((coin, i) => ({
        ...coin,
        rank: i + 1,
        change24h: +rand(-5, 50).toFixed(1),
        thumb: null, // We'll use the icon letter instead
    }));
};

// ---- Whale Transactions ----
const EXCHANGES = ['Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'OKX', 'Bybit'];
const SYMBOLS = ['BTC', 'ETH', 'USDT', 'SOL', 'XRP'];
const WHALE_AMOUNTS = {
    BTC: { min: 200, max: 2500, priceBase: 67000 },
    ETH: { min: 5000, max: 80000, priceBase: 2500 },
    USDT: { min: 10000000, max: 300000000, priceBase: 1 },
    SOL: { min: 50000, max: 500000, priceBase: 148 },
    XRP: { min: 5000000, max: 100000000, priceBase: 0.55 },
};

export const generateMockWhale = (forceNew = false) => {
    const symbol = pick(SYMBOLS);
    const config = WHALE_AMOUNTS[symbol];
    const quantity = randInt(config.min, config.max);
    const price = config.priceBase + rand(-config.priceBase * 0.05, config.priceBase * 0.05);
    const volume = quantity * price;
    const volumeM = volume / 1000000;

    const isInbound = Math.random() > 0.5;
    const exchange = pick(EXCHANGES);
    const from = isInbound ? 'Unknown Wallet' : exchange;
    const to = isInbound ? exchange : 'Unknown Wallet';

    const minutesAgo = forceNew ? 0 : randInt(1, 30);

    return {
        id: `whale_${Date.now()}_${randInt(1000, 9999)}`,
        symbol,
        quantity: quantity.toLocaleString(),
        volume: volume.toLocaleString(),
        value: volumeM >= 1 ? `$${volumeM.toFixed(1)}M` : `$${(volume / 1000).toFixed(0)}K`,
        valueRaw: volume,
        time: minutesAgo === 0 ? 'Just now' : `${minutesAgo} min ago`,
        timestamp: Date.now() - minutesAgo * 60000,
        type: volumeM >= 50 ? 'ALARM' : 'NORMAL',
        from,
        to,
    };
};

export const getMockWhales = (count = 8) => {
    return Array(count)
        .fill(null)
        .map(() => generateMockWhale())
        .sort((a, b) => b.timestamp - a.timestamp);
};

// ---- Exchange Flows ----
export const getMockExchangeFlows = () => {
    const hours = 10;
    return Array(hours)
        .fill(null)
        .map((_, i) => ({
            inflow: +rand(800, 3500).toFixed(0),
            outflow: +rand(600, 3200).toFixed(0),
            label: `${24 - (hours - i) * 2}h`,
        }));
};
