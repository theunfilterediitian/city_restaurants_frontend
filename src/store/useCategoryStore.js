import { create } from 'zustand';
import { api } from '../services/api'; // Fixed import

export const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await api.getCategories();
      set({ categories: res.data });
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (data) => {
    await api.createCategory(data);
    const res = await api.getCategories(); // Refresh list
    set({ categories: res.data });
  },

  // ADD THIS ACTION
  deleteCategory: async (categoryId) => {
    if (!window.confirm("Are you sure? This will remove the category from all products.")) return;
    
    try {
      await api.deleteCategory(categoryId);
      // Filter out the deleted category from state immediately
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== category_id)
      }));
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Only admins can delete categories.");
    }
  }
}));