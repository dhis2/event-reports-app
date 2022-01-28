import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    TIME_DIMENSION_EVENT_DATE,
    TIME_DIMENSION_ENROLLMENT_DATE,
    TIME_DIMENSION_INCIDENT_DATE,
    TIME_DIMENSION_SCHEDULED_DATE,
    TIME_DIMENSION_LAST_UPDATED,
    getTimeDimensions,
    NAME_PARENT_PROPERTY_PROGRAM,
} from '../../modules/timeDimensions.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import { sGetUiProgramId, sGetUiProgramStage } from '../../reducers/ui.js'
import { DimensionsList } from './DimensionsList/index.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from './ProgramDimensionsPanel/ProgramDimensionsPanel.js'

const TimeDimensions = ({ selectedInputType }) => {
    const programId = useSelector(sGetUiProgramId)
    const stageId = useSelector(sGetUiProgramStage)
    const program = useSelector((state) => sGetMetadataById(state, programId))

    let dimensions = []
    if (selectedInputType && program && stageId) {
        const timeDimensions = getTimeDimensions()
        const stages = program.programStages || [{}]
        const stage = stages.find(({ id }) => stageId === id)
        const isEvent = selectedInputType === OUTPUT_TYPE_EVENT
        const withRegistration =
            program.programType === PROGRAM_TYPE_WITH_REGISTRATION

        const getName = (t) => {
            const name =
                t.nameParentProperty === NAME_PARENT_PROPERTY_PROGRAM
                    ? program[t.nameProperty]
                    : stage[t.nameProperty]
            return name || t.defaultName
        }

        const dimensionIds = []
        if (isEvent) {
            dimensionIds.push(TIME_DIMENSION_EVENT_DATE)
        }

        if (withRegistration) {
            dimensionIds.push(TIME_DIMENSION_ENROLLMENT_DATE)

            isEvent &&
                !stage.hideDueDate &&
                dimensionIds.push(TIME_DIMENSION_SCHEDULED_DATE)

            program.displayIncidentDate &&
                dimensionIds.push(TIME_DIMENSION_INCIDENT_DATE)
        }

        if (withRegistration || (isEvent && !withRegistration)) {
            dimensionIds.push(TIME_DIMENSION_LAST_UPDATED)
        }

        dimensions = dimensionIds.map((dimensionId) => ({
            id: dimensionId,
            dimensionType: DIMENSION_ID_PERIOD,
            name: getName(timeDimensions[dimensionId]),
        }))
    }

    return (
        <DimensionsList
            setIsListEndVisible={Function.prototype}
            dimensions={dimensions}
        />
    )
}

TimeDimensions.propTypes = {
    selectedInputType: PropTypes.string,
}

export default TimeDimensions
