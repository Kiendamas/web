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

export const contactoApi = createApi({
  reducerPath: 'contactoApi',
  baseQuery,
  tagTypes: ['Contacto'],
  endpoints: (builder) => ({
    // Create contact message
    createContacto: builder.mutation({
      query: (contactoData) => ({
        url: '/contacto',
        method: 'POST',
        body: contactoData,
      }),
      invalidatesTags: ['Contacto'],
    }),
  }),
});

export const {
  useCreateContactoMutation,
} = contactoApi;
