import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from './slices';

export const store = configureStore({
    reducer: rootReducer,
});

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>;