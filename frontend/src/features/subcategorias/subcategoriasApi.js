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

export const subcategoriasApi = createApi({
  reducerPath: 'subcategoriasApi',
  baseQuery,
  tagTypes: ['Subcategoria'],
  endpoints: (builder) => ({
    // Get all subcategories
    getSubcategorias: builder.query({
      query: () => '/subcategorias',
      providesTags: ['Subcategoria'],
    }),

    // Get subcategory by ID
    getSubcategoriaById: builder.query({
      query: (id) => `/subcategorias/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subcategoria', id }],
    }),

    // Create subcategory
    createSubcategoria: builder.mutation({
      query: (subcategoriaData) => ({
        url: '/subcategorias',
        method: 'POST',
        body: subcategoriaData,
      }),
      invalidatesTags: ['Subcategoria'],
    }),

    // Update subcategory
    updateSubcategoria: builder.mutation({
      query: ({ id, ...subcategoriaData }) => ({
        url: `/subcategorias/${id}`,
        method: 'PUT',
        body: subcategoriaData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Subcategoria', id }, 'Subcategoria'],
    }),

    // Delete subcategory
    deleteSubcategoria: builder.mutation({
      query: (id) => ({
        url: `/subcategorias/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subcategoria'],
    }),
  }),
});

export const {
  useGetSubcategoriasQuery,
  useGetSubcategoriaByIdQuery,
  useCreateSubcategoriaMutation,
  useUpdateSubcategoriaMutation,
  useDeleteSubcategoriaMutation,
} = subcategoriasApi;
