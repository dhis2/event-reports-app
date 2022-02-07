import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ChipOverlay from './Layout/ChipOverlay.js'
import { DimensionItemOverlay } from './MainSidebar/DimensionItem/DimensionItemOverlay.js'
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

const OuterDndContext = ({ children }) => {
    const [sourceAxis, setSourceAxis] = useState(null)

    const draggingId = useSelector(sGetUiDraggingId)
    const layout = useSelector(sGetUiLayout)
    const metadata = useSelector(sGetMetadata)

    const chipItems = useSelector((state) =>
        sGetUiItemsByDimension(state, draggingId)
    )
    const dispatch = useDispatch()

    const getDragOverlay = () => {
        if (!draggingId) {
            return null
        }

        const name = metadata[draggingId].name
        const dimensionType = metadata[draggingId].dimensionType

        if (sourceAxis === SOURCE_DIMENSIONS) {
            return (
                <DimensionItemOverlay
                    name={name}
                    dimensionType={dimensionType}
                />
            )
        } else {
            return (
                <ChipOverlay
                    dimensionType={dimensionType}
                    dimensionId={draggingId}
                    dimensionName={name}
                    items={chipItems}
                />
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
        dispatch(acAddUiLayoutDimensions({ [dimensionId]: { axisId, index } }))
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
        const sourceIndex = active.data.current.sortable.index
        const dimensionId = active.id
        const destinationIndex = over.data.current?.sortable?.index || 0
        const destinationAxisId = over.data.current
            ? over.data.current.sortable.containerId
            : over.id

        if (sourceAxisId === SOURCE_DIMENSIONS) {
            addDimensionToLayout({
                axisId: destinationAxisId,
                index: destinationIndex,
                dimensionId,
            })
        } else {
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
            collisionDetection={pointerWithin}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
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
