import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import messageHandler from "../utlis/messageHandler";
import decode from "jwt-decode";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
  },
  reducers: {
    setProfile: (state, { payload }) => {
      state.profile = payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;
const token = localStorage.getItem("token");

export const updateInfo = (userData, id, setUserLogged) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/clients/update-data/${id}`,
      data: userData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", response.data.token);
    setUserLogged(decode(response.data.token))
    messageHandler("success", response.data.message);
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const updatePassword = (userData, id, resetForm, setUserLogged) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/clients/update-password/${id}`,
      data: userData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", response.data.token);
    setUserLogged(decode(response.data.token))
    messageHandler("success", response.data.message);
    resetForm({
      actualPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (e) {
    messageHandler("error", e.response.data.message);
    }
};

// export const uploadImage = (id, formData, setUserLogged) => async () => {
//   try {
//     const response = await axios({
//       url: `${process.env.REACT_APP_SERVER}/clients/upload-photo/${id}`,
//       method: "PATCH",
//       data: formData,
//     });
//     localStorage.setItem("token", response.data.token);
//     setUserLogged(decode(response.data.token))
//     messageHandler("success", response.data.message);
//   } catch (e) {
//     messageHandler("error", e.response.data.message);
//   }
// };

// export const deleteImage = (id, setUserLogged, userLogged) => async () => {
//   try {
//     const response = await axios({
//       url: `${process.env.REACT_APP_SERVER}/clients/delete-profile-picture/${id}`,
//       method: "DELETE",
//     });
//     localStorage.setItem("token", response.data.token);
//     setUserLogged(decode(response.data.token))
//     console.log(userLogged)
//     messageHandler("success", response.data.message);
//   } catch (e) {
//     messageHandler("error", e.response.data.message);
//   }
// };

export default profileSlice.reducer;
