import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import messageHandler from 'utils/messageHandler';

const clientsSlice = createSlice({
  name: 'colaboradores',
  initialState: {
    user: {} 
  },
  reducers: {
    setColabs: (state, { payload }) => {
      state.data = payload;
    }
  }
});

export const { setColabs } = clientsSlice.actions;

export const getClient = (id) => async (dispatch) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/clients/${id}`,
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export default clientsSlice.reducer