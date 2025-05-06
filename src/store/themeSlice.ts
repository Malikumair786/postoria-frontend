import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  currentTheme: Theme;
}

const getInitialTheme = (): Theme => {
  const savedTheme = Cookies.get('theme') as Theme | undefined;
  return savedTheme || 'system';
};

const initialState: ThemeState = {
  currentTheme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
      Cookies.set('theme', action.payload, { expires: 30 });
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;