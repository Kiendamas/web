import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  successMessage: null,
  formData: {
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  },
};

const contactoSlice = createSlice({
  name: 'contacto',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    clearFormData: (state) => {
      state.formData = initialState.formData;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetContacto: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setFormData,
  clearFormData,
  setSuccessMessage,
  clearSuccessMessage,
  setError,
  clearError,
  resetContacto,
} = contactoSlice.actions;

// Selectors
export const selectContactoLoading = (state) => state.contacto.isLoading;
export const selectContactoError = (state) => state.contacto.error;
export const selectContactoSuccessMessage = (state) => state.contacto.successMessage;
export const selectContactoFormData = (state) => state.contacto.formData;

export default contactoSlice.reducer;
