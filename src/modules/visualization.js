import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    DIMENSION_ID_PERIOD,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { DEFAULT_CURRENT } from '../reducers/current.js'
import { DEFAULT_VISUALIZATION } from '../reducers/visualization.js'
import { DIMENSION_TYPE_DATA_ELEMENT } from './dimensionTypes.js'
import { default as options } from './options.js'

export const OUTPUT_TYPE_EVENT = 'EVENT'
export const OUTPUT_TYPE_ENROLLMENT = 'ENROLLMENT'

export const outputTypeMap = {
    [OUTPUT_TYPE_EVENT]: {
        name: i18n.t('Event'),
        description: i18n.t(
            'Events are single registrations or incidents in a program'
        ),
    },
    [OUTPUT_TYPE_ENROLLMENT]: {
        name: i18n.t('Enrollment'),
        description: i18n.t('Programs track enrollments across time'),
    },
}

export const transformVisualization = (visualization) => ({
    ...visualization,
    [AXIS_ID_COLUMNS]: visualization[AXIS_ID_COLUMNS].map((dimensionObj) =>
        transformDimension(dimensionObj, visualization.outputType)
    ),
    [AXIS_ID_ROWS]: visualization[AXIS_ID_ROWS].map((dimensionObj) =>
        transformDimension(dimensionObj, visualization.outputType)
    ),
    [AXIS_ID_FILTERS]: visualization[AXIS_ID_FILTERS].map((dimensionObj) =>
        transformDimension(dimensionObj, visualization.outputType)
    ),
})

const transformDimension = (dimensionObj, outputType) => {
    // TODO waiting for the time dimensions work to be completed.
    // most likely there are going to be constants for these time dimensions
    const timeDimensionMap = {
        [OUTPUT_TYPE_EVENT]: 'eventDate',
        [OUTPUT_TYPE_ENROLLMENT]: 'enrollmentDate',
    }

    if (dimensionObj.dimensionType === 'PROGRAM_DATA_ELEMENT') {
        return {
            ...dimensionObj,
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
        }
    } else if (dimensionObj.dimension === DIMENSION_ID_PERIOD) {
        return {
            ...dimensionObj,
            dimension: timeDimensionMap[outputType],
        }
    } else {
        return dimensionObj
    }
}

export const visTypes = [
    { type: VIS_TYPE_LINE_LIST },
    { type: VIS_TYPE_PIVOT_TABLE, disabled: true },
]

export const visTypeDescriptions = {
    // TODO review descriptions @scott @joe
    [VIS_TYPE_LINE_LIST]: i18n.t('TEXT description for Line List'),
    [VIS_TYPE_PIVOT_TABLE]: i18n.t('TEXT description for Pivot Table'),
}

export const getVisualizationFromCurrent = (current) => {
    const visualization = Object.assign({}, current)
    const nonSavableOptions = Object.keys(options).filter(
        (option) => !options[option].savable
    )

    nonSavableOptions.forEach((option) => delete visualization[option])

    return visualization
}

export const getVisualizationState = (visualization, current) => {
    if (current === DEFAULT_CURRENT) {
        return STATE_EMPTY
    } else if (visualization === DEFAULT_VISUALIZATION) {
        return STATE_UNSAVED
    } else if (current === visualization) {
        return STATE_SAVED
    } else {
        return STATE_DIRTY
    }
}

export const STATE_EMPTY = 'EMPTY'
export const STATE_SAVED = 'SAVED'
export const STATE_UNSAVED = 'UNSAVED'
export const STATE_DIRTY = 'DIRTY'
