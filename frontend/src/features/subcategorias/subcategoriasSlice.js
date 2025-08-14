import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subcategorias: [],
  selectedSubcategoria: null,
  isLoading: false,
  error: null,
  filters: {
    categoriaId: null,
  },
};

const subcategoriasSlice = createSlice({
  name: 'subcategorias',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSubcategorias: (state, action) => {
      state.subcategorias = action.payload;
    },
    setSelectedSubcategoria: (state, action) => {
      state.selectedSubcategoria = action.payload;
    },
    addSubcategoria: (state, action) => {
      state.subcategorias.push(action.payload);
    },
    updateSubcategoria: (state, action) => {
      const index = state.subcategorias.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.subcategorias[index] = action.payload;
      }
    },
    removeSubcategoria: (state, action) => {
      state.subcategorias = state.subcategorias.filter(s => s.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setSubcategorias,
  setSelectedSubcategoria,
  addSubcategoria,
  updateSubcategoria,
  removeSubcategoria,
  setFilters,
  clearFilters,
  setError,
  clearError,
} = subcategoriasSlice.actions;

// Selectors
export const selectSubcategorias = (state) => state.subcategorias.subcategorias;
export const selectSelectedSubcategoria = (state) => state.subcategorias.selectedSubcategoria;
export const selectSubcategoriasLoading = (state) => state.subcategorias.isLoading;
export const selectSubcategoriasError = (state) => state.subcategorias.error;
export const selectSubcategoriasFilters = (state) => state.subcategorias.filters;

export default subcategoriasSlice.reducer;
