import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import messageHandler from 'utils/messageHandler';

const realEstateSlice = createSlice({
    name: 'realEstate',
    initialState: {
        data: {},
        branchOfficesArray: []
    },
    reducers: {
        setCurrentRealEstate: (state, { payload }) => {
            state.data = payload;
        },
        setRealEstatesBranchOffices: (state, { payload }) => {
            state.branchOfficesArray = payload
        }
    }
});

export const { setCurrentRealEstate, setRealEstatesBranchOffices } = realEstateSlice.actions;

export const getRealEstateData = (id, token) => async (dispatch) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${process.env.REACT_APP_SERVER}/real-estate/${id}`,
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(setCurrentRealEstate({ id: response.data.id, name: response.data.name }))
        dispatch(setRealEstatesBranchOffices(response.data.branchOffice))
    } catch (e) {
        console.log(e)
    }
}

export default realEstateSlice.reducer;
