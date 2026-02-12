import { create } from 'zustand';

const useWhaleStore = create((set, get) => ({
    whales: [],
    addWhale: (whale) =>
        set((state) => ({
            whales: [whale, ...state.whales].slice(0, 50),
        })),
    setWhales: (whales) => set({ whales }),
    clearWhales: () => set({ whales: [] }),
}));

export default useWhaleStore;
