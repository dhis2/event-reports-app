import { GenericServerError } from '../modules/error'
import { SET_USER } from '../reducers/user'
import { acSetLoadError } from './loader'

export const acSetUser = value => ({
    type: SET_USER,
    value,
})
