import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paquetes: [],
  selectedPaquete: null,
  isLoading: false,
  error: null,
  filters: {
    categoria: null,
    subcategoria: null,
    precioMin: null,
    precioMax: null,
    duracion: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const paquetesSlice = createSlice({
  name: 'paquetes',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPaquetes: (state, action) => {
      state.paquetes = action.payload;
    },
    setSelectedPaquete: (state, action) => {
      state.selectedPaquete = action.payload;
    },
    addPaquete: (state, action) => {
      state.paquetes.push(action.payload);
    },
    updatePaquete: (state, action) => {
      const index = state.paquetes.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.paquetes[index] = action.payload;
      }
    },
    removePaquete: (state, action) => {
      state.paquetes = state.paquetes.filter(p => p.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
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
  setPaquetes,
  setSelectedPaquete,
  addPaquete,
  updatePaquete,
  removePaquete,
  setFilters,
  clearFilters,
  setPagination,
  setError,
  clearError,
} = paquetesSlice.actions;

// Selectors
export const selectPaquetes = (state) => state.paquetes.paquetes;
export const selectSelectedPaquete = (state) => state.paquetes.selectedPaquete;
export const selectPaquetesLoading = (state) => state.paquetes.isLoading;
export const selectPaquetesError = (state) => state.paquetes.error;
export const selectPaquetesFilters = (state) => state.paquetes.filters;
export const selectPaquetesPagination = (state) => state.paquetes.pagination;

export default paquetesSlice.reducer;
