import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const paquetesApi = createApi({
  reducerPath: 'paquetesApi',
  baseQuery,
  tagTypes: ['Paquete'],
  endpoints: (builder) => ({
    // Get all packages
    getPaquetes: builder.query({
      query: () => '/paquetes',
      providesTags: ['Paquete'],
    }),

    // Get packages by category
    getPaquetesByCategoria: builder.query({
      query: (categoriaId) => `/paquetes/categoria/${categoriaId}`,
      providesTags: ['Paquete'],
    }),

    // Get packages by subcategory
    getPaquetesBySubcategoria: builder.query({
      query: (subcategoriaId) => `/paquetes/subcategoria/${subcategoriaId}`,
      providesTags: ['Paquete'],
    }),

    // Get packages with filters
    getPaquetesFiltered: builder.query({
      query: ({ categoria, subcategoria, tipo }) => {
        let url = '/paquetes?';
        const params = new URLSearchParams();
        if (categoria) params.append('categoria', categoria);
        if (subcategoria) params.append('subcategoria', subcategoria);
        if (tipo) params.append('tipo', tipo);
        return url + params.toString();
      },
      providesTags: ['Paquete'],
    }),

    // Get package by ID
    getPaqueteById: builder.query({
      query: (id) => `/paquetes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Paquete', id }],
    }),

    // Create package with images
    createPaquete: builder.mutation({
      query: (formData) => ({
        url: '/paquetes',
        method: 'POST',
        body: formData,
        // No set Content-Type, let browser set it for FormData
      }),
      invalidatesTags: ['Paquete'],
    }),

    // Update package with images
    updatePaquete: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/paquetes/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Paquete', id }, 'Paquete'],
    }),

    // Delete package
    deletePaquete: builder.mutation({
      query: (id) => ({
        url: `/paquetes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Paquete'],
    }),
  }),
});

export const {
  useGetPaquetesQuery,
  useGetPaquetesByCategoriaQuery,
  useGetPaquetesBySubcategoriaQuery,
  useGetPaquetesFilteredQuery,
  useGetPaqueteByIdQuery,
  useCreatePaqueteMutation,
  useUpdatePaqueteMutation,
  useDeletePaqueteMutation,
} = paquetesApi;
