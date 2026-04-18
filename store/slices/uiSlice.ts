import { createSlice } from "@reduxjs/toolkit";

interface IUState {
    isRefreshing: boolean,
};

const initialState: IUState = {
    isRefreshing: false
};

const uiSlice = createSlice({
    name: 'ui',
    initialState: initialState,
    reducers: {
        startRefresh: (state) => {
            state.isRefreshing = true;
        },
        endRefresh: (state) => {
            state.isRefreshing = false;
        }
    
    }
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;