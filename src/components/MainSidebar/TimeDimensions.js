import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import React, { useState, useEffect } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { acAddMetadata } from '../../actions/metadata.js'
import {
    DIMENSION_TYPE_EVENT_DATE,
    DIMENSION_TYPE_ENROLLMENT_DATE,
    DIMENSION_TYPE_INCIDENT_DATE,
    DIMENSION_TYPE_SCHEDULED_DATE,
    DIMENSION_TYPE_LAST_UPDATED,
} from '../../modules/dimensionTypes.js'
import { SOURCE_DIMENSIONS } from '../../modules/layout.js'
import {
    getTimeDimensions,
    NAME_PARENT_PROPERTY_PROGRAM,
} from '../../modules/timeDimensions.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import {
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiProgramStageId,
} from '../../reducers/ui.js'
import { DimensionItem } from './DimensionItem/index.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from './ProgramDimensionsPanel/ProgramDimensionsPanel.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'
import styles from './TimeDimensions.module.css'

const getName = (dimension, program, stage) => {
    if (!dimension.nameParentProperty) {
        return dimension.defaultName
    }
    const name =
        dimension.nameParentProperty === NAME_PARENT_PROPERTY_PROGRAM
            ? program[dimension.nameProperty]
            : stage[dimension.nameProperty]
    return name || dimension.defaultName
}

const TimeDimensions = () => {
    const dispatch = useDispatch()
    const [dimensions, setDimensions] = useState([])
    const { getIsDimensionSelected } = useSelectedDimensions()
    const selectedInputType = useSelector(sGetUiInputType)

    const programId = useSelector(sGetUiProgramId)
    const stageId = useSelector(sGetUiProgramStageId)
    const program =
        useSelector((state) => sGetMetadataById(state, programId)) || {}
    const stage = useSelector((state) => sGetMetadataById(state, stageId)) || {}
    const timeDimensions = getTimeDimensions()
    const dimensionIds = Object.keys(timeDimensions)

    useEffect(() => {
        const enabledDimensionIds = []

        if (selectedInputType && program.programType && stage.id) {
            const isEvent = selectedInputType === OUTPUT_TYPE_EVENT
            const withRegistration =
                program.programType === PROGRAM_TYPE_WITH_REGISTRATION

            if (isEvent) {
                enabledDimensionIds.push(DIMENSION_TYPE_EVENT_DATE)
            }

            if (withRegistration) {
                enabledDimensionIds.push(DIMENSION_TYPE_ENROLLMENT_DATE)

                isEvent &&
                    !stage.hideDueDate &&
                    enabledDimensionIds.push(DIMENSION_TYPE_SCHEDULED_DATE)

                program.displayIncidentDate &&
                    enabledDimensionIds.push(DIMENSION_TYPE_INCIDENT_DATE)
            }

            if (isEvent || withRegistration) {
                enabledDimensionIds.push(DIMENSION_TYPE_LAST_UPDATED)
            }
        }

        const dimensionsArr = dimensionIds.map((dimensionId) => ({
            id: dimensionId,
            dimensionType: DIMENSION_ID_PERIOD,
            name: getName(timeDimensions[dimensionId], program, stage),
            isDisabled: !enabledDimensionIds.includes(dimensionId),
        }))

        setDimensions(dimensionsArr)

        const dimensionsMetadata = dimensionsArr.reduce(
            (metadata, { id, name }) => {
                metadata[id] = { id, name }
                return metadata
            },
            {}
        )

        dispatch(acAddMetadata(dimensionsMetadata))
    }, [selectedInputType, programId, stageId])

    return (
        <Droppable droppableId={SOURCE_DIMENSIONS} isDropDisabled={true}>
            {(droppableProvided) => (
                <div
                    className={styles.list}
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                >
                    {dimensions.map((dimension, i) => (
                        <Draggable
                            draggableId={dimension.id}
                            index={i}
                            isDragDisabled={false}
                            key={dimension.id}
                        >
                            {(provided, snapshot) => (
                                <>
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <DimensionItem
                                            dimensionType={
                                                dimension.dimensionType
                                            }
                                            name={dimension.name}
                                            id={dimension.id}
                                            selected={getIsDimensionSelected(
                                                dimension.id
                                            )}
                                            disabled={dimension.isDisabled}
                                            optionSet={dimension.optionSet}
                                            valueType={dimension.valueType}
                                        />
                                    </div>
                                    {snapshot.isDragging && (
                                        <div>Placeholder</div>
                                    )}
                                </>
                            )}
                        </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default TimeDimensions
