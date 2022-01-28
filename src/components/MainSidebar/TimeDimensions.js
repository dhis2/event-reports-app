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
    timeDimensions,
} from '../../modules/timeDimensions.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import { sGetUiProgramId, sGetUiProgramStage } from '../../reducers/ui.js'
import { DimensionsList } from './DimensionsList/index.js'
import {
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
    PROGRAM_TYPE_WITH_REGISTRATION,
} from './ProgramDimensionsPanel/ProgramDimensionsPanel.js'

const TimeDimensions = ({ selectedInputType }) => {
    const programId = useSelector(sGetUiProgramId)
    const stageId = useSelector(sGetUiProgramStage)
    const program = useSelector((state) => sGetMetadataById(state, programId))

    let dimensions = []
    if (selectedInputType && program && stageId) {
        const stages = program.programStages || [{}]
        const stage = stages.find(({ id }) => stageId === id)

        const getName = (t) => {
            const name =
                t.programOrStage === 'program'
                    ? program[t.nameProperty]
                    : stage[t.nameProperty]
            return name || t.defaultName
        }

        const programType = program.programType

        let dimensionIds = []
        if (
            selectedInputType === OUTPUT_TYPE_EVENT &&
            programType === PROGRAM_TYPE_WITHOUT_REGISTRATION
        ) {
            dimensionIds = [
                TIME_DIMENSION_EVENT_DATE,
                TIME_DIMENSION_LAST_UPDATED,
            ]
        } else if (
            selectedInputType === OUTPUT_TYPE_EVENT &&
            programType === PROGRAM_TYPE_WITH_REGISTRATION
        ) {
            dimensionIds = [
                TIME_DIMENSION_EVENT_DATE,
                TIME_DIMENSION_ENROLLMENT_DATE,
            ]
            if (!stage.hideDueDate) {
                dimensionIds.push(TIME_DIMENSION_SCHEDULED_DATE)
            }
            if (program.displayIncidentDate) {
                dimensionIds.push(TIME_DIMENSION_INCIDENT_DATE)
            }
            dimensionIds.push(TIME_DIMENSION_LAST_UPDATED)
        } else if (
            selectedInputType === OUTPUT_TYPE_ENROLLMENT &&
            programType === PROGRAM_TYPE_WITH_REGISTRATION
        ) {
            dimensionIds = [TIME_DIMENSION_ENROLLMENT_DATE]
            if (program.displayIncidentDate) {
                dimensionIds.push(TIME_DIMENSION_INCIDENT_DATE)
            }
            dimensionIds.push(TIME_DIMENSION_LAST_UPDATED)
        }

        dimensions = dimensionIds.map((d) => {
            return {
                id: d,
                dimensionType: DIMENSION_ID_PERIOD,
                name: getName(timeDimensions[d]),
            }
        })
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
