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

export const categoriasApi = createApi({
  reducerPath: 'categoriasApi',
  baseQuery,
  tagTypes: ['Categoria'],
  endpoints: (builder) => ({
    // Get all categories
    getCategorias: builder.query({
      query: () => '/categorias',
      providesTags: ['Categoria'],
    }),

    // Get category by ID
    getCategoriaById: builder.query({
      query: (id) => `/categorias/${id}`,
      providesTags: (result, error, id) => [{ type: 'Categoria', id }],
    }),

    // Create category
    createCategoria: builder.mutation({
      query: (categoriaData) => ({
        url: '/categorias',
        method: 'POST',
        body: categoriaData,
      }),
      invalidatesTags: ['Categoria'],
    }),

    // Update category
    updateCategoria: builder.mutation({
      query: ({ id, ...categoriaData }) => ({
        url: `/categorias/${id}`,
        method: 'PUT',
        body: categoriaData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Categoria', id }, 'Categoria'],
    }),

    // Delete category
    deleteCategoria: builder.mutation({
      query: (id) => ({
        url: `/categorias/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categoria'],
    }),
  }),
});

export const {
  useGetCategoriasQuery,
  useGetCategoriaByIdQuery,
  useCreateCategoriaMutation,
  useUpdateCategoriaMutation,
  useDeleteCategoriaMutation,
} = categoriasApi;
