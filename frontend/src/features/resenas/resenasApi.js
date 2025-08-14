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

export const resenasApi = createApi({
  reducerPath: 'resenasApi',
  baseQuery,
  tagTypes: ['Resena'],
  endpoints: (builder) => ({
    // Get all reviews
    getResenas: builder.query({
      query: () => '/resenas',
      providesTags: ['Resena'],
    }),

    // Get review by ID
    getResenaById: builder.query({
      query: (id) => `/resenas/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resena', id }],
    }),

    // Create review
    createResena: builder.mutation({
      query: (resenaData) => ({
        url: '/resenas',
        method: 'POST',
        body: resenaData,
      }),
      invalidatesTags: ['Resena'],
    }),

    // Update review
    updateResena: builder.mutation({
      query: ({ id, ...resenaData }) => ({
        url: `/resenas/${id}`,
        method: 'PUT',
        body: resenaData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Resena', id }, 'Resena'],
    }),

    // Delete review
    deleteResena: builder.mutation({
      query: (id) => ({
        url: `/resenas/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resena'],
    }),
  }),
});

export const {
  useGetResenasQuery,
  useGetResenaByIdQuery,
  useCreateResenaMutation,
  useUpdateResenaMutation,
  useDeleteResenaMutation,
} = resenasApi;
