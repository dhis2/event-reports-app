import {
    DndContext,
    DragOverlay,
    rectIntersection,
    closestCorners,
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

function isPointWithinRect(point, rect) {
    const { top, left, bottom, right } = rect
    return (
        top <= point.y &&
        point.y <= bottom &&
        left <= point.x &&
        point.x <= right
    )
}
function cornersOfRectangle({ left, top, height, width }) {
    return [
        {
            x: left,
            y: top,
        },
        {
            x: left + width,
            y: top,
        },
        {
            x: left,
            y: top + height,
        },
        {
            x: left + width,
            y: top + height,
        },
    ]
}

function distanceBetween(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}
function sortCollisionsAsc({ data: { value: a } }, { data: { value: b } }) {
    return a - b
}
const pointerWithin = ({ droppableContainers, pointerCoordinates }) => {
    if (!pointerCoordinates) {
        return []
    }

    const collisions = []

    for (const droppableContainer of droppableContainers) {
        const {
            id,
            rect: { current: rect },
        } = droppableContainer

        if (rect && isPointWithinRect(pointerCoordinates, rect)) {
            /* There may be more than a single rectangle intersecting
             * with the pointer coordinates. In order to sort the
             * colliding rectangles, we measure the distance between
             * the pointer and the corners of the intersecting rectangle
             */
            const corners = cornersOfRectangle(rect)
            // console.log('pointer is within rect, rect corners', corners)
            const distances = corners.reduce((accumulator, corner) => {
                return accumulator + distanceBetween(pointerCoordinates, corner)
            }, 0)
            const effectiveDistance = Number((distances / 4).toFixed(4))
            collisions.push({
                id,
                data: {
                    droppableContainer,
                    value: effectiveDistance,
                },
            })
        }
    }

    return collisions.sort(sortCollisionsAsc)
}
function centerOfRectangle(rect, left = rect.left, top = rect.top) {
    return {
        x: left + rect.width * 0.5,
        y: top + rect.height * 0.5,
    }
}

const closestCenter = ({ collisionRect, droppableContainers }) => {
    const centerRect = centerOfRectangle(
        collisionRect,
        collisionRect.left,
        collisionRect.top
    )
    const collisions = []

    for (const droppableContainer of droppableContainers) {
        const {
            id,
            rect: { current: rect },
        } = droppableContainer

        if (rect) {
            const distBetween = distanceBetween(
                centerOfRectangle(rect),
                centerRect
            )
            collisions.push({
                id,
                data: {
                    droppableContainer,
                    value: distBetween,
                },
            })
        }
    }

    return collisions.sort(sortCollisionsAsc)
}

const OuterDndContext = ({ children }) => {
    const [{ algorithm }, setCollisionDetectionAlgorithm] = useState({
        algorithm: rectIntersection,
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
            closestCorners: closestCorners,
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
            const idx =
                destinationIndex !== -1 ? destinationIndex : sourceList.length
            sourceList.splice(idx, 0, moved)

            dispatch(
                acSetUiLayout({
                    ...layout,
                    [sourceAxisId]: sourceList,
                })
            )
        } else {
            const destList = Array.from(layout[destinationAxisId])
            const index =
                destinationIndex !== -1 ? destinationIndex : destList.length
            dispatch(
                acAddUiLayoutDimensions({
                    [moved]: {
                        axisId: destinationAxisId,
                        index,
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

        if (!over?.id) {
            return
        }

        const sourceAxisId = active.data.current.sortable.containerId
        const dimensionId = active.id
        let destinationIndex = over.data.current?.sortable?.index || 0
        const destinationAxisId =
            over.data.current?.sortable?.containerId || over.id

        if (['columns', 'filters'].includes(over.id)) {
            destinationIndex = -1
        }

        if (sourceAxisId === SOURCE_DIMENSIONS) {
            // console.log('add ', dimensionId, 'at index', destinationIndex)
            addDimensionToLayout({
                axisId: destinationAxisId,
                index: destinationIndex,
                dimensionId,
            })
        } else {
            const sourceIndex = active.data.current.sortable.index
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
                <option value="">--Choose collision strategy--</option>
                <option value="rectIntersection">RectIntersection</option>
                <option value="pointerWithin">PointerWithin</option>
                <option value="closestCenter">ClosestCenter</option>
                <option value="closestCorners">ClosestCorners</option>
            </select>
        </DndContext>
    )
}

OuterDndContext.propTypes = {
    children: PropTypes.node,
}

export default OuterDndContext
