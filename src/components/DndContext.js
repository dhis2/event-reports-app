import {
    DndContext,
    DragOverlay,
    rectIntersection,
    closestCenter,
    pointerWithin,
} from '@dnd-kit/core'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acSetUiLayout,
    acSetUiDraggingId,
} from '../actions/ui.js'
import { SOURCE_DIMENSIONS } from '../modules/layout.js'
import { sGetMetadata } from '../reducers/metadata.js'
import {
    sGetUiLayout,
    sGetUiItemsByDimension,
    sGetUiDraggingId,
} from '../reducers/ui.js'
import styles from './DndContext.module.css'
import ChipOverlay from './Layout/ChipOverlay.js'
import { DimensionItemOverlay } from './MainSidebar/DimensionItem/DimensionItemOverlay.js'

const FIRST_POSITION = 0

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

const OuterDndContext = ({ children }) => {
    const [{ algorithm }, setCollisionDetectionAlgorithm] = useState({
        algorithm: rectIntersectionCustom,
    })
    const [sourceAxis, setSourceAxis] = useState(null)

    const draggingId = useSelector(sGetUiDraggingId)
    const layout = useSelector(sGetUiLayout)
    const metadata = useSelector(sGetMetadata)

    const chipItems = useSelector((state) =>
        sGetUiItemsByDimension(state, draggingId)
    )
    const dispatch = useDispatch()

    const onChange = (e) => {
        const strategyMap = {
            closestCenter: closestCenter,
            rectIntersection: rectIntersection,
            rectIntersectionCustom: rectIntersectionCustom,
            pointerWithin: pointerWithin,
        }
        setCollisionDetectionAlgorithm({
            algorithm: strategyMap[e.target.value],
        })
    }

    const getDragOverlay = () => {
        if (!draggingId) {
            return null
        }

        const name = metadata[draggingId].name
        const dimensionType = metadata[draggingId].dimensionType

        if (sourceAxis === SOURCE_DIMENSIONS) {
            return (
                <div className={styles.overlay}>
                    <DimensionItemOverlay
                        name={name}
                        dimensionType={dimensionType}
                    />
                </div>
            )
        } else {
            return (
                <div className={styles.overlay}>
                    <ChipOverlay
                        dimensionType={dimensionType}
                        dimensionId={draggingId}
                        dimensionName={name}
                        items={chipItems}
                    />
                </div>
            )
        }
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
            over?.data?.current?.sortable?.containerId === SOURCE_DIMENSIONS
        ) {
            // dropped over non-droppable, or over dimension panel
            return
        }
        const sourceAxisId = active.data.current.sortable.containerId
        const destinationAxisId =
            over.data.current?.sortable?.containerId || over.id
        let destinationIndex =
            over.data.current?.sortable?.index || FIRST_POSITION

        const isDroppingInFirstPosition = () => {
            return ['columns', 'filters'].includes(over.id)
        }

        if (sourceAxisId === SOURCE_DIMENSIONS) {
            if (isDroppingInFirstPosition()) {
                destinationIndex = FIRST_POSITION
            } else {
                ++destinationIndex
            }

            addDimensionToLayout({
                axisId: destinationAxisId,
                index: destinationIndex,
                dimensionId: active.id,
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
            collisionDetection={algorithm}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
        >
            {children}
            <DragOverlay
                dropAnimation={{
                    duration: 400,
                    easing: 'ease',
                }}
            >
                {getDragOverlay()}
            </DragOverlay>
            <select
                name="collisionStrategy"
                id="collision-strategy"
                className={styles.strategy}
                onChange={onChange}
            >
                <option value="rectIntersectionCustom" selected>
                    Pointer with 40x80px rect intersection
                </option>
                <option value="rectIntersection">RectIntersection</option>
                <option value="pointerWithin">PointerWithin</option>
                <option value="closestCenter">ClosestCenter</option>
            </select>
        </DndContext>
    )
}

OuterDndContext.propTypes = {
    children: PropTypes.node,
}

export default OuterDndContext
