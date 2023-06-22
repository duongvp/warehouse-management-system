import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import jwt from 'jwt-decode'
// export const fetchUserPermissions = createAsyncThunk(
//   'user/fetchPermissions', async (params) => {
//     const response = await fetch(`http://localhost:5000/api/role/listPermissionActive/${params.roleId}`); // call your API here
//     return response.json(); // extract the relevant data from API response
//   }
// );

const getCookie = (name) => {
  const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return cookieValue ? cookieValue.pop() : null;
}

const initialState = {
  token: getCookie('token'),
  data: JSON.parse(localStorage.getItem("user")) || {},
  permissions: getCookie('token') ? [...jwt(getCookie('token'))?.roles] : []
}
console.log(initialState)
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.token = payload.token
      state.data = payload.user
      state.permissions = [...jwt(payload.token)?.roles ?? []]
    },
    logout: (state) => {
      state.token = ''
    },
  },
  // extraReducers: builder => {
  //   builder
  //     .addCase(fetchUserPermissions.fulfilled, (state, action) => {
  //       state.permissions = action.payload;
  //     })
  // },
})

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions

export default userSlice.reducer
