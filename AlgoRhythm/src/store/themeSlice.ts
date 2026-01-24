import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'algorhythm-theme';

interface ThemeState {
    theme: Theme;
}

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        return saved || 'dark';
    }
    return 'dark';
};

const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement;
    if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
    } else {
        root.removeAttribute('data-theme');
    }
};

const initialState: ThemeState = {
    theme: getInitialTheme(),
};

// Apply initial theme immediately
applyThemeToDOM(initialState.theme);

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            localStorage.setItem(THEME_STORAGE_KEY, action.payload);
            applyThemeToDOM(action.payload);
        },
        toggleTheme: (state) => {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            state.theme = newTheme;
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            applyThemeToDOM(newTheme);
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;