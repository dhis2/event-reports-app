import {
    DIMENSION_TYPE_DE,
    DIMENSION_TYPE_PA,
    DIMENSION_TYPE_PI,
} from '../modules/visualization.js'

const dataElementsQuery = {
    resource: 'dataElements',
    id: ({ id }) => id,
    params: {
        fields: 'legendSets[id,name]',
    },
}

const trackedEntityAttributesQuery = {
    resource: 'trackedEntityAttributes',
    id: ({ id }) => id,
    params: {
        fields: 'legendSets[id,name]',
    },
}

const programIndicatorsQuery = {
    resource: 'programIndicators',
    id: ({ id }) => id,
    params: {
        fields: 'legendSets[id,name]',
    },
}

const legendSetsQuery = {
    resource: 'legendSets',
    id: ({ id }) => id,
    params: {
        fields: [
            'id',
            'displayName~rename(name)',
            'legends[id,displayName~rename(name),startValue,endValue]',
        ],
        paging: 'false',
    },
}

export const apiFetchLegendSetById = async ({ dataEngine, id }) => {
    const response = await dataEngine.query(
        { legendSet: legendSetsQuery },
        {
            variables: {
                id,
            },
            onError: (error) => console.log('Error: ', error),
        }
    )

    return response.legendSet
}

export const apiFetchLegendSetsByDimension = async ({
    dataEngine,
    dimensionId,
    dimensionType,
}) => {
    let query
    switch (dimensionType) {
        case DIMENSION_TYPE_DE:
            query = dataElementsQuery
            break
        case DIMENSION_TYPE_PA:
            query = trackedEntityAttributesQuery
            break
        case DIMENSION_TYPE_PI:
            query = programIndicatorsQuery
            break
        default:
            throw new Error(`${dimensionType} is not a valid dimension type`)
    }
    const response = await dataEngine.query(
        { legendSets: query },
        {
            variables: {
                id: dimensionId,
            },
            onError: (error) => console.log('Error: ', error),
        }
    )

    return response.legendSets.legendSets
}
