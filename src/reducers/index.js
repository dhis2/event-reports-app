import { combineReducers } from 'redux'
import current from './current.js'
import legendSets from './legendSets.js'
import loader from './loader.js'
import metadata from './metadata.js'
import settings from './settings.js'
import ui from './ui.js'
import user from './user.js'
import visualization from './visualization.js'

// Reducers

export default combineReducers({
    current,
    legendSets,
    loader,
    metadata,
    settings,
    ui,
    user,
    visualization,
})
