import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null, // هنا سنخزن بيانات الأدمن
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    clearAdmin: (state) => {
      state.admin = null;
    },
  },
});

export const { setAdmin, clearAdmin } = userSlice.actions;
export default userSlice.reducer;
