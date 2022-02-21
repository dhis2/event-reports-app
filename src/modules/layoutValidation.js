import {
    AXIS,
    dimensionIsValid,
    layoutGetDimension,
    VIS_TYPE_LINE_LIST,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import { DIMENSION_TYPES_TIME } from './dimensionTypes.js'
import {
    noColumnsError,
    noOrgUnitError,
    noPeriodError,
    noProgramError,
} from './error.js'

// Layout validation helper functions
const isAxisValid = (axis) =>
    AXIS.isValid(axis) &&
    axis.some((axisItem) =>
        dimensionIsValid(axisItem, {
            requireItems: false,
        })
    )

const validateDimension = (dimension, error, requireItems) => {
    if (!(dimension && dimensionIsValid(dimension, { requireItems }))) {
        if (error) {
            throw error
        }
    }

    return true
}

const validateAxis = (axis, error) => {
    if (!isAxisValid(axis)) {
        throw error
    }
}

const validateLineListLayout = (layout) => {
    validateAxis(layout.columns, noColumnsError())
    validateDimension(
        layoutGetDimension(layout, DIMENSION_ID_ORGUNIT),
        noOrgUnitError(),
        true
    )

    let layoutHasTimeDimension = false
    DIMENSION_TYPES_TIME.forEach((dimensionId) => {
        const dimension = layoutGetDimension(layout, dimensionId)
        dimension &&
            validateDimension(dimension, null, true) &&
            (layoutHasTimeDimension = true)
    })

    if (!layoutHasTimeDimension) {
        throw noPeriodError()
    }

    if (!layout?.program?.id) {
        throw noProgramError()
    }
}

export const validateLayout = (layout) => {
    switch (layout.type) {
        case VIS_TYPE_LINE_LIST:
        default:
            return validateLineListLayout(layout)
    }
}
