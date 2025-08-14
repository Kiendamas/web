import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSlide: 0,
  isAutoPlay: true,
  isVideoPlaying: false,
};

const heroSlidesSlice = createSlice({
  name: 'heroSlides',
  initialState,
  reducers: {
    setCurrentSlide: (state, action) => {
      state.currentSlide = action.payload;
    },
    nextSlide: (state, action) => {
      const totalSlides = action.payload;
      state.currentSlide = (state.currentSlide + 1) % totalSlides;
    },
    prevSlide: (state, action) => {
      const totalSlides = action.payload;
      state.currentSlide = (state.currentSlide - 1 + totalSlides) % totalSlides;
    },
    toggleAutoPlay: (state) => {
      state.isAutoPlay = !state.isAutoPlay;
    },
    setVideoPlaying: (state, action) => {
      state.isVideoPlaying = action.payload;
    },
    resetSlider: (state) => {
      state.currentSlide = 0;
      state.isVideoPlaying = false;
    },
  },
});

export const {
  setCurrentSlide,
  nextSlide,
  prevSlide,
  toggleAutoPlay,
  setVideoPlaying,
  resetSlider,
} = heroSlidesSlice.actions;

export default heroSlidesSlice.reducer;
