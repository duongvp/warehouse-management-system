import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: localStorage.getItem('currentWH')
}

export const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    changeWarehouse: (state, {payload}) => {
      state.data = payload
    }, 
  },
})

// Action creators are generated for each case reducer function
export const { changeWarehouse } = warehouseSlice.actions

export default warehouseSlice.reducer
