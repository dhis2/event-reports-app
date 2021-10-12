import { combineReducers } from 'redux'
import alertbar from './alertbar'
import current from './current'
import metadata from './metadata'
import ui from './ui'
import user from './user'
import visualization from './visualization'

// Reducers

export default combineReducers({
    alertbar,
    current,
    metadata,
    ui,
    user,
    visualization,
})
