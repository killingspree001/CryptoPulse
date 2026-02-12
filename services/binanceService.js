import useWhaleStore from '../store/useWhaleStore';
import { getWhaleTransactions } from './whaleAlertService';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/btcusdt@trade';

let socket = null;

export const startWhaleTracker = async () => {
    if (socket) return;

    // Initial fetch from Whale Alert for "On-Chain" historical context
    const initialWhales = await getWhaleTransactions();
    initialWhales.forEach(w => useWhaleStore.getState().addWhale(w));

    socket = new WebSocket(BINANCE_WS_URL);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p);
        const quantity = parseFloat(data.q);
        const volume = price * quantity;

        if (volume >= 100000) {
            const whale = {
                id: data.t.toString(),
                symbol: 'BTC',
                price: price.toLocaleString(),
                quantity: quantity.toFixed(3),
                volume: volume.toLocaleString(),
                value: (volume / 1000000).toFixed(1) + 'M',
                time: new Date().toLocaleTimeString(),
                timestamp: data.T,
                type: volume >= 500000 ? 'ALARM' : 'NORMAL'
            };
            useWhaleStore.getState().addWhale(whale);
        }
    };

    socket.onerror = (error) => {
        console.error('Binance WebSocket Error:', error);
    };

    socket.onclose = () => {
        console.log('Binance WebSocket Closed. Reconnecting...');
        socket = null;
        setTimeout(startWhaleTracker, 5000);
    };
};

export const stopWhaleTracker = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};
