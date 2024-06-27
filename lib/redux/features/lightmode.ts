import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark' |'default';
}

const initialState: ThemeState = {
  mode: 'default',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'light' | 'dark' | 'default'>) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = themeSlice.actions;

export default themeSlice.reducer;
