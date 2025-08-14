import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categorias: [],
  selectedCategoria: null,
  isLoading: false,
  error: null,
};

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCategorias: (state, action) => {
      state.categorias = action.payload;
    },
    setSelectedCategoria: (state, action) => {
      state.selectedCategoria = action.payload;
    },
    addCategoria: (state, action) => {
      state.categorias.push(action.payload);
    },
    updateCategoria: (state, action) => {
      const index = state.categorias.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categorias[index] = action.payload;
      }
    },
    removeCategoria: (state, action) => {
      state.categorias = state.categorias.filter(c => c.id !== action.payload);
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
  setCategorias,
  setSelectedCategoria,
  addCategoria,
  updateCategoria,
  removeCategoria,
  setError,
  clearError,
} = categoriasSlice.actions;

// Selectors
export const selectCategorias = (state) => state.categorias.categorias;
export const selectSelectedCategoria = (state) => state.categorias.selectedCategoria;
export const selectCategoriasLoading = (state) => state.categorias.isLoading;
export const selectCategoriasError = (state) => state.categorias.error;

export default categoriasSlice.reducer;
