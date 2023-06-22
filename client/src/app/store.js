import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import warehouseReducer from '../features/warehouse/warehouseSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    warehouse: warehouseReducer
  },
})