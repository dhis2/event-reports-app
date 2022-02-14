import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
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
import { MainSidebarSection } from './MainSidebarSection.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from './ProgramDimensionsPanel/ProgramDimensionsPanel.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

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

const DraggableDimensionItem = (props) => {
    const {
        attributes,
        listeners,
        isSorting,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.id,
    })

    if (props.disabled) {
        return <>{props.children}</>
    }

    const style = transform
        ? {
              transform: isSorting
                  ? undefined
                  : CSS.Translate.toString({
                        x: transform.x,
                        y: transform.y,
                        scaleX: 1,
                        scaleY: 1,
                    }),
              transition,
          }
        : undefined
    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            {props.children}
        </div>
    )
}

DraggableDimensionItem.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    id: PropTypes.string,
}

export const TimeDimensions = () => {
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
            selected: getIsDimensionSelected(dimensionId),
            disabled: !enabledDimensionIds.includes(dimensionId),
            //optionSet
            //valueType
        }))

        setDimensions(dimensionsArr)

        const dimensionsMetadata = dimensionsArr.reduce(
            (metadata, { id, name }) => {
                metadata[id] = { id, name, dimensionType: DIMENSION_ID_PERIOD }
                return metadata
            },
            {}
        )

        dispatch(acAddMetadata(dimensionsMetadata))
    }, [selectedInputType, programId, stageId])

    return (
        <MainSidebarSection header={i18n.t('Time dimensions')}>
            <SortableContext
                id={SOURCE_DIMENSIONS}
                items={dimensions}
                strategy={verticalListSortingStrategy}
            >
                {dimensions.map((dimension) => (
                    <DraggableDimensionItem key={dimension.id} {...dimension}>
                        <DimensionItem {...dimension} />
                    </DraggableDimensionItem>
                ))}
            </SortableContext>
        </MainSidebarSection>
    )
}
