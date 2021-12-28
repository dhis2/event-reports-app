import {
    DIMENSION_ID_ORGUNIT,
    layoutGetAxisIdDimensionIdsObject,
    layoutGetDimensionIdItemIdsObject,
} from '@dhis2/analytics'
import { getAdaptedUiLayoutByType, getInverseLayout } from './layout.js'
import { getOptionsFromVisualization } from './options.js'
import { removeLastPathSegment } from './orgUnit.js'
import { VIS_TYPE_LINE_LIST, VIS_TYPE_PIVOT_TABLE } from './visualization.js'

const lineListUiAdapter = (ui) => ({
    ...ui,
    layout: getAdaptedUiLayoutByType(ui.layout, VIS_TYPE_LINE_LIST),
})

export const getAdaptedUiByType = (ui) => {
    switch (ui.type) {
        case VIS_TYPE_LINE_LIST:
            return lineListUiAdapter(ui)
        case VIS_TYPE_PIVOT_TABLE:
        default:
            return ui
    }
}

export const getUiFromVisualization = (vis, currentState = {}) => ({
    ...currentState,
    options: getOptionsFromVisualization(vis),
    layout: layoutGetAxisIdDimensionIdsObject(vis),
    itemsByDimension: layoutGetDimensionIdItemIdsObject(vis),
    conditions: getConditionsFromVisualization(vis),
    parentGraphMap:
        vis.parentGraphMap ||
        getParentGraphMapFromVisualization(vis) ||
        currentState.parentGraphMap,
})

export const getParentGraphMapFromVisualization = (vis) => {
    const dimensionIdsByAxis = layoutGetAxisIdDimensionIdsObject(vis)
    const inverseLayout = getInverseLayout(dimensionIdsByAxis)
    const ouAxis = inverseLayout[DIMENSION_ID_ORGUNIT]

    if (!ouAxis) {
        return {}
    }

    const parentGraphMap = {}
    const ouDimension = vis[ouAxis].find(
        (dimension) => dimension.dimension === DIMENSION_ID_ORGUNIT
    )

    ouDimension.items
        .filter((orgUnit) => orgUnit.path)
        .forEach((orgUnit) => {
            if ('/' + orgUnit.id === orgUnit.path) {
                // root org unit case
                parentGraphMap[orgUnit.id] = ''
            } else {
                const path = removeLastPathSegment(orgUnit.path)
                parentGraphMap[orgUnit.id] =
                    path[0] === '/' ? path.substr(1) : path
            }
        })

    return parentGraphMap
}

const getConditionsFromVisualization = (vis) =>
    [...vis.columns, ...vis.rows, ...vis.filters]
        .filter((item) => item.filter || item.legendSet)
        .reduce(
            (acc, key) => ({
                ...acc,
                [key.dimension]: {
                    condition: key.filter,
                    legendSet: key.legendSet?.id,
                },
            }),
            {}
        )

export const getDefaultCurrentRepetition = () => [0]
export const getDefaultUiRepetition = () => ({
    mostRecent: 1,
    oldest: 0,
})

export const parseCurrentRepetition = (repetition) => {
    const defaultUiRepetition = getDefaultUiRepetition()

    if (!repetition.length) {
        return defaultUiRepetition
    }

    const rep = [...repetition]

    const mostRecent = rep.filter((n) => n < 1).length
    const oldest = rep.filter((n) => n > 0).length

    return mostRecent === 0 && oldest === 0
        ? defaultUiRepetition
        : { mostRecent, oldest }
}

export const parseUiRepetition = (repetition) => {
    if (
        repetition.mostRecent < 0 ||
        repetition.oldest < 0 ||
        (repetition.mostRecent === 0 && repetition.oldest === 0)
    ) {
        return getDefaultCurrentRepetition()
    }

    return [
        ...new Array(repetition.oldest).fill().map((_, i) => i + 1),
        ...new Array(repetition.mostRecent)
            .fill()
            .map((_, i) => -i + 0)
            .sort((a, b) => a - b),
    ]
}
