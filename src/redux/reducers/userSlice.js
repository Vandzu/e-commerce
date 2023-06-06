import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'user',
    initialState: {
        id: '',
    },
    reducers: {
        changeId(state, {payload}) {
            return {...state, id: payload}
        },
    }
})

export const {changeId} = slice.actions

export const selectUser = state => state.user

export default slice.reducer