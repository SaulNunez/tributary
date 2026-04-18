import { combineReducers } from "@reduxjs/toolkit";
import itemsReducer from "./itemSlice";
import subscriptionsReducer from "./subscriptionsSlice";
import uiReducer from "./uiSlice";

export const rootReducer = combineReducers({
    subscriptions: subscriptionsReducer,
    items: itemsReducer,
    ui: uiReducer
});