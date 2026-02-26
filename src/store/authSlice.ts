import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
    email: string | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    email: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<string | null>) => {
            state.email = action.payload;
            state.isLoggedIn = !!action.payload;
        },
    },
});


export const { setSession } = authSlice.actions;
export default authSlice.reducer;