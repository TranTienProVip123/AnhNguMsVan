import { create } from "zustand";

const useSearchStore = create((set) => ({
    searchTerm: '',
    setSearchTerm: (newTerm) => set({ searchTerm: newTerm }),
}));
export default useSearchStore;

