import {
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
    DIMENSION_ID_ORGUNIT,
    getDimensionById,
    DIMENSION_ID_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { getMainDimensions } from './mainDimensions.js'
import { getTimeDimensions, getTimeDimensionName } from './timeDimensions.js'

const getOrganisationUnits = () => ({
    [USER_ORG_UNIT]: i18n.t('User organisation unit'),
    [USER_ORG_UNIT_CHILDREN]: i18n.t('User sub-units'),
    [USER_ORG_UNIT_GRANDCHILDREN]: i18n.t('User sub-x2-units'),
})

const getFixedDimensions = () => ({
    [DIMENSION_ID_ORGUNIT]: getDimensionById(DIMENSION_ID_ORGUNIT),
    [DIMENSION_ID_PERIOD]: getDimensionById(DIMENSION_ID_PERIOD),
})

export const getDefaultMetadata = () => ({
    ...getMainDimensions(),
    ...getDefaulTimeDimensionsMetadata(),
    ...getFixedDimensions(),
    ...Object.entries({
        ...getOrganisationUnits(),
    }).reduce((acc, [key, value]) => ({ ...acc, [key]: { name: value } }), {}),
})

export const getDefaulTimeDimensionsMetadata = () => {
    return Object.values(getTimeDimensions()).reduce(
        (acc, { id, name, dimensionType }) => {
            acc[id] = {
                id,
                name,
                dimensionType,
            }
            return acc
        },
        {}
    )
}

export const getProgramAsMetadata = (program) => ({
    ...program.programStages.reduce((acc, stage) => {
        acc[stage.id] = stage
        return acc
    }, {}),
    [program.id]: program,
})

export const getDynamicTimeDimensionsMetadata = (stage, program) => ({
    ...Object.values(getTimeDimensions()).reduce((acc, dimension) => {
        acc[dimension.id] = {
            id: dimension.id,
            dimensionType: dimension.dimensionType,
            name: getTimeDimensionName(dimension, program, stage),
        }
        return acc
    }, {}),
})
