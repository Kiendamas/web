import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const heroSlidesApi = createApi({
  reducerPath: 'heroSlidesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/hero-slides`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['HeroSlide'],
  endpoints: (builder) => ({
    // Obtener slides públicos (activos)
    getHeroSlides: builder.query({
      query: () => '/',
      providesTags: ['HeroSlide'],
    }),
    
    // Obtener todos los slides (admin)
    getAllHeroSlides: builder.query({
      query: () => '/admin/all',
      providesTags: ['HeroSlide'],
    }),
    
    // Obtener un slide específico
    getHeroSlide: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'HeroSlide', id }],
    }),
    
    // Crear nuevo slide
    createHeroSlide: builder.mutation({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['HeroSlide'],
    }),
    
    // Actualizar slide
    updateHeroSlide: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'HeroSlide', id },
        'HeroSlide',
      ],
    }),
    
    // Eliminar slide
    deleteHeroSlide: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HeroSlide'],
    }),
    
    // Cambiar estado activo/inactivo
    toggleHeroSlideActive: builder.mutation({
      query: (id) => ({
        url: `/${id}/toggle-active`,
        method: 'PUT',
      }),
      invalidatesTags: ['HeroSlide'],
    }),
    
    // Actualizar orden de slides
    updateHeroSlidesOrder: builder.mutation({
      query: (slides) => ({
        url: '/admin/update-order',
        method: 'PUT',
        body: { slides },
      }),
      invalidatesTags: ['HeroSlide'],
    }),
  }),
});

export const {
  useGetHeroSlidesQuery,
  useGetAllHeroSlidesQuery,
  useGetHeroSlideQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
  useToggleHeroSlideActiveMutation,
  useUpdateHeroSlidesOrderMutation,
} = heroSlidesApi;
