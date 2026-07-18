import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import chatStateReducer from "./chat-state";

// Configure the Redux store with middleware
export const store = configureStore({
  reducer: {
    chat: chatStateReducer,
    // Add other reducers here as needed
  },
  // The middleware configuration enables Redux Thunk by default
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types if they contain non-serializable values
        ignoredActions: [],
      },
    }),
});

// Export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Create typed hooks to use throughout your app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
