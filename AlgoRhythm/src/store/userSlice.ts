import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/User';

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
}

const storedUser = localStorage.getItem('user');

const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedUser,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('token', action.payload.token || ''); // <-- zapisz token osobno też
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
