import {
    AXIS_ID_COLUMNS,
    AXIS_ID_FILTERS,
    AXIS_ID_ROWS,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'

// Exclude one or many dimensions from layout
export const getFilteredLayout = (layout, excludedIds) => {
    const ids = Array.isArray(excludedIds) ? excludedIds : [excludedIds]

    return {
        [AXIS_ID_COLUMNS]:
            layout[AXIS_ID_COLUMNS]?.filter((dim) => !ids.includes(dim)) || [],
        [AXIS_ID_ROWS]:
            layout[AXIS_ID_ROWS]?.filter((dim) => !ids.includes(dim)) || [],
        [AXIS_ID_FILTERS]:
            layout[AXIS_ID_FILTERS]?.filter((dim) => !ids.includes(dim)) || [],
    }
}

export const LAYOUT_TYPE_LINE_LIST = 'LAYOUT_TYPE_LINE_LIST'
export const LAYOUT_TYPE_PIVOT_TABLE = 'LAYOUT_TYPE_PIVOT_TABLE'

export const getAdaptedUiLayoutByType = (layout, type) => {
    switch (type) {
        case VIS_TYPE_LINE_LIST: {
            return getLineListLayout(layout)
        }
        case VIS_TYPE_PIVOT_TABLE:
        default:
            return layout
    }
}

// Transform from ui.layout to line list layout format
const getLineListLayout = (layout) => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: [...columns, ...rows],
        [AXIS_ID_ROWS]: [],
        [AXIS_ID_FILTERS]: [...layout[AXIS_ID_FILTERS]],
    }
}

// Accepts layout: { columns: ['dx'] }
// Returns inverse layout: { dx: 'columns' }
export const getInverseLayout = (layout) => {
    const entries = Object.entries(layout)
    const map = {}

    entries.forEach(([axisId, dimensionIds]) => {
        dimensionIds.forEach((id) => {
            map[id] = axisId
        })
    })

    return map
}
