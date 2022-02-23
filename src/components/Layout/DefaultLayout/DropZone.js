import { useDroppable } from '@dnd-kit/core'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { getDropzoneId, FIRST, LAST } from '../../DndContext.js'
import styles from './styles/DropZone.module.css'

const DropZone = ({ position, axisId, firstElementId }) => {
    const { isOver, setNodeRef, active } = useDroppable({
        id: getDropzoneId(axisId, position),
    })

    let draggingOver
    if (position === FIRST) {
        draggingOver = firstElementId === active?.id ? false : isOver
    } else {
        draggingOver = isOver
    }

    let isEmpty
    if (position === LAST) {
        isEmpty = false
    } else {
        isEmpty = !firstElementId
    }

    return (
        <div
            ref={setNodeRef}
            className={cx(styles.dropZone, {
                [styles.isOver]: draggingOver,
                [styles.isEmpty]: isEmpty,
                [styles.first]: position === FIRST,
                [styles.last]: position === LAST,
            })}
        >
            <div className={styles.dropIndicator}></div>
        </div>
    )
}

DropZone.propTypes = {
    axisId: PropTypes.string,
    firstElementId: PropTypes.string,
    position: PropTypes.string,
}

export { DropZone }
