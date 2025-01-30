import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminlogout, getAdmin } from "../thunks/admin";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  isAdmin: false,
  loader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
extraReducers:(builder)=>{

  builder.addCase(adminLogin.fulfilled,(state,action)=>{
    state.isAdmin=true,
    toast.success(action.payload)
  })
  .addCase(adminLogin.rejected,(state,action)=>{
    state.isAdmin=false,
    toast.success(action.error.message)
  })
  .addCase(getAdmin.fulfilled,(state,action)=>{

    if(action.payload){
      state.isAdmin=true;
    }else{
    state.isAdmin=false;
  }
 
  })
  .addCase(getAdmin.rejected,(state,action)=>{
    state.isAdmin=false;

  })

  .addCase(adminlogout.fulfilled,(state,action)=>{
    state.isAdmin=false,
    toast.success(action.payload)
  })
  .addCase(adminlogout.rejected,(state,action)=>{
    state.isAdmin=true,
    toast.success(action.error.message)
  })
}


});

export default authSlice;

export const { userExists,userNotExists} = authSlice.actions;
