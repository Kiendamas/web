import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resenas: [],
  selectedResena: null,
  isLoading: false,
  error: null,
  filters: {
    paqueteId: null,
    rating: null,
    userId: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const resenasSlice = createSlice({
  name: 'resenas',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setResenas: (state, action) => {
      state.resenas = action.payload;
    },
    setSelectedResena: (state, action) => {
      state.selectedResena = action.payload;
    },
    addResena: (state, action) => {
      state.resenas.push(action.payload);
    },
    updateResena: (state, action) => {
      const index = state.resenas.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.resenas[index] = action.payload;
      }
    },
    removeResena: (state, action) => {
      state.resenas = state.resenas.filter(r => r.id !== action.payload);
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
  setResenas,
  setSelectedResena,
  addResena,
  updateResena,
  removeResena,
  setFilters,
  clearFilters,
  setPagination,
  setError,
  clearError,
} = resenasSlice.actions;

// Selectors
export const selectResenas = (state) => state.resenas.resenas;
export const selectSelectedResena = (state) => state.resenas.selectedResena;
export const selectResenasLoading = (state) => state.resenas.isLoading;
export const selectResenasError = (state) => state.resenas.error;
export const selectResenasFilters = (state) => state.resenas.filters;
export const selectResenasPagination = (state) => state.resenas.pagination;

export default resenasSlice.reducer;
