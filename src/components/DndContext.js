import { DndContext } from '@dnd-kit/core'
import PropTypes from 'prop-types'
import React from 'react'
import { connect, useDispatch } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    acSetUiLayout,
    acSetUiDraggingId,
} from '../actions/ui.js'
import { SOURCE_DIMENSIONS } from '../modules/layout.js'
import { sGetUiLayout, sGetUiItems } from '../reducers/ui.js'

const OuterDndContext = ({
    children,
    layout,
    onAddDimensions,
    onReorderDimensions,
}) => {
    const dispatch = useDispatch()
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

            onReorderDimensions({
                ...layout,
                [sourceAxisId]: sourceList,
            })
        } else {
            onAddDimensions({
                [moved]: {
                    axisId: destinationAxisId,
                    index: destinationIndex,
                },
            })
        }
    }

    const addDimensionToLayout = ({ axisId, index, dimensionId }) => {
        onAddDimensions({ [dimensionId]: { axisId, index } })
        //TODO: Add onDropWithoutItems
    }

    const onDragStart = (event) => {
        dispatch(acSetUiDraggingId(event.active.id))
    }

    const onDragCancel = () => {
        dispatch(acSetUiDraggingId(null))

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

        if (destinationAxisId === SOURCE_DIMENSIONS) {
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
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
            {children}
        </DndContext>
    )
}

OuterDndContext.propTypes = {
    children: PropTypes.node,
    layout: PropTypes.object,
    onAddDimensions: PropTypes.func,
    onReorderDimensions: PropTypes.func,
}

const mapStateToProps = (state) => ({
    layout: sGetUiLayout(state),
    itemsByDimension: sGetUiItems(state),
})

const mapDispatchToProps = {
    onAddDimensions: acAddUiLayoutDimensions,
    onReorderDimensions: acSetUiLayout,
}

export default connect(mapStateToProps, mapDispatchToProps)(OuterDndContext)
