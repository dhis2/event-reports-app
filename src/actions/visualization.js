import {
    SET_VISUALIZATION,
    CLEAR_VISUALIZATION,
} from '../reducers/visualization'

export const acSetVisualization = visualization => ({
    type: SET_VISUALIZATION,
    value: visualization,
})

export const acClearVisualization = () => ({
    type: CLEAR_VISUALIZATION,
})
