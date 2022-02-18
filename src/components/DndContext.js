import { AXIS_ID_COLUMNS, AXIS_ID_FILTERS } from '@dhis2/analytics'
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    MouseSensor,
} from '@dnd-kit/core'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acSetUiLayout,
    acSetUiDraggingId,
} from '../actions/ui.js'
import { parseConditionsStringToArray } from '../modules/conditions.js'
import { sGetMetadata } from '../reducers/metadata.js'
import {
    sGetUiLayout,
    sGetUiItemsByDimension,
    sGetUiDraggingId,
    sGetUiConditionsByDimension,
} from '../reducers/ui.js'
import styles from './DndContext.module.css'
import { ChipBase } from './Layout/ChipBase.js'
import chipStyles from './Layout/styles/Chip.module.css'
import { DimensionItemBase } from './MainSidebar/DimensionItem/DimensionItemBase.js'

// Names for dnd sources
export const TIME_DIMENSIONS = 'time'
export const MAIN_DIMENSIONS = 'main'
export const YOUR_DIMENSIONS = 'your'
export const PROGRAM_DIMENSIONS = 'program'

const FIRST_POSITION = 0
const SOURCE_DIMENSIONS = [
    MAIN_DIMENSIONS,
    TIME_DIMENSIONS,
    YOUR_DIMENSIONS,
    PROGRAM_DIMENSIONS,
]

function getIntersectionRatio(entry, target) {
    const top = Math.max(target.top, entry.top)
    const left = Math.max(target.left, entry.left)
    const right = Math.min(target.left + target.width, entry.left + entry.width)
    const bottom = Math.min(
        target.top + target.height,
        entry.top + entry.height
    )
    const width = right - left
    const height = bottom - top

    if (left < right && top < bottom) {
        const targetArea = target.width * target.height
        const entryArea = entry.width * entry.height
        const intersectionArea = width * height
        const intersectionRatio =
            intersectionArea / (targetArea + entryArea - intersectionArea)
        return Number(intersectionRatio.toFixed(4))
    } // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)

    return 0
}
function sortCollisionsDesc({ data: { value: a } }, { data: { value: b } }) {
    return b - a
}

const rectIntersectionCustom = ({
    pointerCoordinates,
    droppableContainers,
}) => {
    // create a rect around the pointerCoords for calculating the intersection
    const pointerRect = {
        width: 80,
        height: 40,
        top: pointerCoordinates.y - 20,
        bottom: pointerCoordinates.y + 20,
        left: pointerCoordinates.x - 40,
        right: pointerCoordinates.x + 40,
    }
    const collisions = []

    for (const droppableContainer of droppableContainers) {
        const {
            id,
            rect: { current: rect },
        } = droppableContainer

        if (rect) {
            const intersectionRatio = getIntersectionRatio(rect, pointerRect)

            if (intersectionRatio > 0) {
                collisions.push({
                    id,
                    data: {
                        droppableContainer,
                        value: intersectionRatio,
                    },
                })
            }
        }
    }

    return collisions.sort(sortCollisionsDesc)
}

const getIdFromDraggingId = (draggingId) => {
    const [id] = draggingId.split('-').reverse()
    return id
}

const OuterDndContext = ({ children }) => {
    const [sourceAxis, setSourceAxis] = useState(null)

    const draggingId = useSelector(sGetUiDraggingId)
    const id = draggingId ? getIdFromDraggingId(draggingId) : null

    const layout = useSelector(sGetUiLayout)
    const metadata = useSelector(sGetMetadata)
    const chipItems =
        useSelector((state) => sGetUiItemsByDimension(state, id)) || []

    const chipConditions =
        useSelector((state) => sGetUiConditionsByDimension(state, id)) || {}

    // Wait 15px movement before starting drag, so that click event isn't overridden
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 15,
        },
    })
    const sensors = useSensors(mouseSensor)

    const dispatch = useDispatch()

    const getDragOverlay = () => {
        if (!id) {
            return null
        }

        // TODO - using the rawDimensionId instead of dimensionId
        // is a temporary workaround
        // until the backend is updated to return programStageId.dimensionId
        // in analytics response.metadata.items
        const [rawDimensionId] = id.split('.').reverse()
        const name = metadata[rawDimensionId].name
        // const name = metadata[id].name
        const dimensionType = metadata[id].dimensionType

        const numberOfConditions =
            parseConditionsStringToArray(chipConditions.condition).length ||
            chipConditions.legendSet
                ? 1
                : 0

        return (
            <div className={styles.overlay}>
                {SOURCE_DIMENSIONS.includes[sourceAxis] ? (
                    <DimensionItemBase
                        name={name}
                        dimensionType={dimensionType}
                    />
                ) : (
                    <div
                        className={cx(
                            chipStyles.chipWrapper,
                            chipStyles.chipWrapperOverlay,
                            {
                                [chipStyles.chipEmpty]:
                                    !chipItems.length && !numberOfConditions,
                            }
                        )}
                    >
                        <ChipBase
                            dimensionName={name}
                            items={chipItems}
                            numberOfConditions={numberOfConditions}
                        />
                    </div>
                )}
            </div>
        )
    }

    const rearrangeLayoutDimensions = ({
        sourceAxisId,
        destinationAxisId,
        sourceIndex,
        destinationIndex,
    }) => {
        const sourceList = Array.from(layout[sourceAxisId])
        const [moved] = sourceList.splice(sourceIndex, 1)

        if (sourceAxisId === destinationAxisId) {
            sourceList.splice(destinationIndex, 0, moved)

            dispatch(
                acSetUiLayout({
                    ...layout,
                    [sourceAxisId]: sourceList,
                })
            )
        } else {
            dispatch(
                acAddUiLayoutDimensions({
                    [moved]: {
                        axisId: destinationAxisId,
                        index: destinationIndex,
                    },
                })
            )
        }
    }

    const addDimensionToLayout = ({ axisId, index, dimensionId }) => {
        const sourceList = Array.from(layout[axisId])
        const idx = index !== -1 ? index : sourceList.length
        dispatch(
            acAddUiLayoutDimensions({ [dimensionId]: { axisId, index: idx } })
        )
        //TODO: Add onDropWithoutItems
    }

    const onDragStart = ({ active }) => {
        setSourceAxis(active.data.current.sortable.containerId)
        dispatch(acSetUiDraggingId(active.id))
    }

    const onDragCancel = () => {
        dispatch(acSetUiDraggingId(null))
    }

    const onDragEnd = (result) => {
        const { active, over } = result

        if (
            !over?.id ||
            SOURCE_DIMENSIONS.includes(
                over?.data?.current?.sortable?.containerId
            )
        ) {
            // dropped over non-droppable or over dimension panel
            return
        }
        const sourceAxisId = active.data.current.sortable.containerId
        const destinationAxisId =
            over.data.current?.sortable?.containerId || over.id
        let destinationIndex =
            over.data.current?.sortable?.index || FIRST_POSITION

        const isDroppingInFirstPosition = () => {
            return [AXIS_ID_COLUMNS, AXIS_ID_FILTERS].includes(over.id)
        }

        if (SOURCE_DIMENSIONS.includes(sourceAxisId)) {
            if (isDroppingInFirstPosition()) {
                destinationIndex = FIRST_POSITION
            } else {
                ++destinationIndex
            }

            addDimensionToLayout({
                axisId: destinationAxisId,
                index: destinationIndex,
                dimensionId: getIdFromDraggingId(active.id),
            })
        } else {
            const sourceIndex = active.data.current.sortable.index

            if (sourceAxisId !== destinationAxisId) {
                ++destinationIndex
            }

            if (isDroppingInFirstPosition()) {
                destinationIndex = FIRST_POSITION
            }

            rearrangeLayoutDimensions({
                sourceAxisId,
                destinationAxisId,
                sourceIndex,
                destinationIndex,
            })
        }
        onDragCancel()
    }

    return (
        <DndContext
            collisionDetection={rectIntersectionCustom}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
            sensors={sensors}
        >
            {children}
            <DragOverlay dropAnimation={null}>{getDragOverlay()}</DragOverlay>
        </DndContext>
    )
}

OuterDndContext.propTypes = {
    children: PropTypes.node,
}

export default OuterDndContext
