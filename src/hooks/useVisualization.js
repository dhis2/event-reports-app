import { useDataQuery } from '@dhis2/app-runtime'

const visualizationQuery = {
    eventReport: {
        resource: 'eventReports',
        id: ({ id }) => id,
        // TODO check if this list is what we need/want (copied from old ER)
        params: {
            fields: '*,interpretations[*,user[id,displayName,userCredentials[username]],likedBy[id,displayName],comments[id,lastUpdated,text,user[id,displayName,userCredentials[username]]]],columns[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],rows[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],filters[dimension,filter,programStage[id],legendSet[id],items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],program[id,displayName~rename(name),enrollmentDateLabel,incidentDateLabel],programStage[id,displayName~rename(name),executionDateLabel],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,userCredentials[username]],href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,dataElementDimensions[legendSet[id,name],dataElement[id,name]]',
        },
    },
}

export const useVisualization = () => {
    return useDataQuery(visualizationQuery, {
        lazy: true,
    })
}
