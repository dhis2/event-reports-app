import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    TIME_DIMENSION_EVENT_DATE,
    TIME_DIMENSION_ENROLLMENT_DATE,
    TIME_DIMENSION_INCIDENT_DATE,
    TIME_DIMENSION_SCHEDULED_DATE,
    TIME_DIMENSION_LAST_UPDATED,
    timeDimensions,
} from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import { sGetUiProgramId, sGetUiProgramStage } from '../../reducers/ui.js'
import { DimensionsList } from './DimensionsList/index.js'
import {
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
    PROGRAM_TYPE_WITH_REGISTRATION,
} from './ProgramDimensionsPanel/ProgramDimensionsPanel.js'
import styles from './TimeDimensions.module.css'

const TimeDimensions = ({ selectedInputType }) => {
    const programId = useSelector(sGetUiProgramId)
    const stageId = useSelector(sGetUiProgramStage)

    const program =
        useSelector((state) => sGetMetadataById(state, programId)) || {}

    const stages = program.programStages || [{}]
    const stage = stageId ? stages.find(({ id }) => stageId === id) : stages[0]

    const getName = (t) => {
        const name =
            t.programOrStage === 'program'
                ? program[t.nameProperty]
                : stage[t.nameProperty]
        return name || t.defaultName
    }

    const pType = program.programType

    let dimensions = []

    if (
        selectedInputType === OUTPUT_TYPE_EVENT &&
        pType === PROGRAM_TYPE_WITHOUT_REGISTRATION
    ) {
        dimensions = [TIME_DIMENSION_EVENT_DATE, TIME_DIMENSION_LAST_UPDATED]
    } else if (
        selectedInputType === OUTPUT_TYPE_EVENT &&
        pType === PROGRAM_TYPE_WITH_REGISTRATION
    ) {
        dimensions = [
            TIME_DIMENSION_EVENT_DATE,
            TIME_DIMENSION_ENROLLMENT_DATE,
            TIME_DIMENSION_SCHEDULED_DATE,
            TIME_DIMENSION_INCIDENT_DATE,
            TIME_DIMENSION_LAST_UPDATED,
        ]
    } else if (
        selectedInputType === OUTPUT_TYPE_ENROLLMENT &&
        pType === PROGRAM_TYPE_WITH_REGISTRATION
    ) {
        dimensions = [
            TIME_DIMENSION_ENROLLMENT_DATE,
            TIME_DIMENSION_INCIDENT_DATE,
            TIME_DIMENSION_LAST_UPDATED,
        ]
    }

    const dimensionObjects = dimensions.map((d) => {
        return {
            id: d,
            dimensionType: DIMENSION_ID_PERIOD,
            name: getName(timeDimensions[d]),
        }
    })

    return (
        <div className={styles.dimensionSection}>
            <div className={styles.dimensionSectionHeader}>
                {i18n.t('Time dimensions')}
            </div>
            <DimensionsList
                setIsListEndVisible={() =>
                    console.log('setIsListEndVisible fn')
                }
                dimensions={dimensionObjects}
            />
        </div>
    )
}

TimeDimensions.propTypes = {
    selectedInputType: PropTypes.string,
}

export default TimeDimensions
