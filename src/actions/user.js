import { apiFetchUserAuthority } from '../api/user'
import { GenericServerError } from '../modules/error'
import { SET_USER, SET_USER_AUTHORITY } from '../reducers/user'
import { acSetLoadError } from './loader'

export const acSetUser = value => ({
    type: SET_USER,
    value,
})

export const acSetUserAuthority = value => ({
    type: SET_USER_AUTHORITY,
    value,
})

export const tLoadUserAuthority =
    authorityKey => async (dispatch, getState, engine) => {
        const onSuccess = response => {
            dispatch(acSetUserAuthority({ [authorityKey]: response.authority }))
        }

        try {
            return onSuccess(await apiFetchUserAuthority(engine, authorityKey))
        } catch (err) {
            dispatch(acSetLoadError(new GenericServerError()))
        }
    }
