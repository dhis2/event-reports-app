/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
import { DIMENSION_ID_ORGUNIT, USER_ORG_UNIT } from '@dhis2/analytics'
import { getFilteredLayout } from '../modules/layout.js'
import { getOptionsForUi } from '../modules/options.js'
import { getAdaptedUiByType, getUiFromVisualization } from '../modules/ui.js'
import { VIS_TYPE_LINE_LIST } from '../modules/visualization.js'

export const SET_UI_OPTIONS = 'SET_UI_OPTIONS'
export const SET_UI_OPTION = 'SET_UI_OPTION'
export const ADD_UI_LAYOUT_DIMENSIONS = 'ADD_UI_LAYOUT_DIMENSIONS'
export const REMOVE_UI_LAYOUT_DIMENSIONS = 'REMOVE_UI_LAYOUT_DIMENSIONS'
export const SET_UI_LAYOUT = 'SET_UI_LAYOUT'
export const SET_UI_FROM_VISUALIZATION = 'SET_UI_FROM_VISUALIZATION'
export const CLEAR_UI = 'CLEAR_UI'
export const TOGGLE_UI_RIGHT_SIDEBAR = 'TOGGLE_UI_RIGHT_SIDEBAR'
export const SET_UI_ACTIVE_MODAL_DIALOG = 'SET_UI_ACTIVE_MODAL_DIALOG'
export const SET_UI_ITEMS = 'SET_UI_ITEMS'
export const ADD_UI_PARENT_GRAPH_MAP = 'ADD_UI_PARENT_GRAPH_MAP'
export const SET_UI_CONDITIONS = 'SET_UI_CONDITIONS'
export const SET_UI_REPETITION = 'SET_UI_REPETITION'

const EMPTY_UI = {
    type: VIS_TYPE_LINE_LIST,
    layout: {
        columns: [],
        filters: [],
    },
    itemsByDimension: {},
    options: {},
    parentGraphMap: {},
    repetitionByDimension: {},
}

export const DEFAULT_UI = {
    type: VIS_TYPE_LINE_LIST,
    layout: {
        // TODO: Populate the layout with the correct default dimensions, these are just temporary for testing
        columns: [DIMENSION_ID_ORGUNIT],
        filters: [],
    },
    itemsByDimension: {
        [DIMENSION_ID_ORGUNIT]: [],
    },
    options: getOptionsForUi(),
    showRightSidebar: false,
    activeModalDialog: null,
    parentGraphMap: {},
    repetitionByDimension: {},
}

const getPreselectedUi = (options) => {
    const rootOrgUnitIds = options.rootOrgUnits
        .filter((root) => root.id)
        .map((root) => root.id)
    const parentGraphMap = { ...DEFAULT_UI.parentGraphMap }

    rootOrgUnitIds.forEach((id) => {
        parentGraphMap[id] = ''
    })

    return {
        ...DEFAULT_UI,
        options: {
            ...DEFAULT_UI.options,
            //digitGroupSeparator,
        },
        itemsByDimension: {
            ...DEFAULT_UI.itemsByDimension,
            [DIMENSION_ID_ORGUNIT]: [USER_ORG_UNIT],
        },
        parentGraphMap,
    }
}

export default (state = EMPTY_UI, action) => {
    switch (action.type) {
        case SET_UI_OPTIONS: {
            return {
                ...state,
                options: {
                    ...state.options,
                    ...action.value,
                },
            }
        }
        // action.value: transfer object (dimensionId:axisId) saying what to add where: { ou: 'rows' }
        // Reducer takes care of swapping (retransfer) if dimension already exists in layout
        case ADD_UI_LAYOUT_DIMENSIONS: {
            const transfers = {
                ...action.value,
            }

            let newLayout = state.layout

            // Add dimension ids to destination (axisId === null means remove from layout)
            Object.entries(transfers).forEach(
                ([dimensionId, { axisId, index }]) => {
                    if (newLayout[axisId]) {
                        // Filter out transferred dimension id (remove from source)
                        newLayout = getFilteredLayout(newLayout, [dimensionId])
                        if (index === null || index === undefined) {
                            newLayout[axisId].push(dimensionId)
                        } else {
                            newLayout[axisId].splice(index, 0, dimensionId)
                        }
                    }
                }
            )

            return {
                ...state,
                layout: newLayout,
            }
        }
        case REMOVE_UI_LAYOUT_DIMENSIONS: {
            return {
                ...state,
                layout: getFilteredLayout(state.layout, action.value),
            }
        }
        case SET_UI_FROM_VISUALIZATION: {
            return getAdaptedUiByType(
                getUiFromVisualization(action.value, state)
            )
        }
        case SET_UI_LAYOUT: {
            return {
                ...state,
                layout: {
                    ...action.value,
                },
            }
        }
        case TOGGLE_UI_RIGHT_SIDEBAR: {
            return {
                ...state,
                showRightSidebar: !state.showRightSidebar,
            }
        }
        case CLEAR_UI: {
            return getPreselectedUi(action.value)
        }
        case SET_UI_ACTIVE_MODAL_DIALOG: {
            return {
                ...state,
                activeModalDialog: action.value || DEFAULT_UI.activeModalDialog,
            }
        }
        case SET_UI_ITEMS: {
            const { dimensionId, itemIds } = action.value

            return {
                ...state,
                itemsByDimension: {
                    ...state.itemsByDimension,
                    [dimensionId]: itemIds,
                },
            }
        }
        case ADD_UI_PARENT_GRAPH_MAP: {
            return {
                ...state,
                parentGraphMap: {
                    ...state.parentGraphMap,
                    ...action.value,
                },
            }
        }
        case SET_UI_CONDITIONS: {
            return {
                ...state,
                conditions: { ...action.value },
            }
        }
        case SET_UI_REPETITION: {
            const { dimensionId, repetition } = action.value

            return {
                ...state,
                repetitionByDimension: {
                    ...state.repetitionByDimension,
                    [dimensionId]: repetition,
                },
            }
        }
        default:
            return state
    }
}

// Selectors

export const sGetUi = (state) => state.ui
export const sGetUiOptions = (state) => sGetUi(state).options
export const sGetUiOption = () => {} // TODO: items stored here should be flattened and reintegrated into sGetUiOptions (above)
export const sGetUiItems = (state) => sGetUi(state).itemsByDimension
export const sGetUiLayout = (state) => sGetUi(state).layout
export const sGetUiShowRightSidebar = (state) => sGetUi(state).showRightSidebar
export const sGetUiType = (state) => sGetUi(state).type
export const sGetUiActiveModalDialog = (state) =>
    sGetUi(state).activeModalDialog
export const sGetUiParentGraphMap = (state) => sGetUi(state).parentGraphMap
export const sGetUiConditions = (state) => sGetUi(state).conditions || {}
export const sGetUiRepetition = (state) => sGetUi(state).repetitionByDimension

// Selectors level 2

export const sGetUiItemsByDimension = (state, dimension) =>
    sGetUiItems(state)[dimension] || DEFAULT_UI.itemsByDimension[dimension]

export const sGetDimensionIdsFromLayout = (state) =>
    Object.values(sGetUiLayout(state)).reduce(
        (ids, axisDimensionIds) => ids.concat(axisDimensionIds),
        []
    )

export const sGetUiConditionsByDimension = (state, dimension) =>
    sGetUiConditions(state)[dimension]

export const sGetUiRepetitionByDimension = (state, dimensionId) =>
    sGetUiRepetition(state)[dimensionId]
