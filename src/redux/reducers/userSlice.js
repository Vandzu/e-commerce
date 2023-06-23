import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'user',
    initialState: {
        id: '',
        admin: false,
    },
    reducers: {
        changeId(state, {payload}) {
            return {...state, id: payload}
        },
        changeAdmin(state, {payload}) {
            return {...state, admin: payload}
        }
    }
})

export const {changeId, changeAdmin} = slice.actions

export const selectUser = state => state.user

export default slice.reducer