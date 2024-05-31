import { createAsyncThunk, createListenerMiddleware } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./rtk";

export const createTypedAsyncThunk = createAsyncThunk.withTypes<{ state: RootState, dispatch: AppDispatch }>()
export const listenerMiddleware = createListenerMiddleware()
