import { useDroppable } from '@dnd-kit/core'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { getDropzoneId, FIRST } from '../../DndContext.js'
import styles from './styles/DropZone.module.css'

const DropZone = ({ axisId, firstElementId }) => {
    const { isOver, setNodeRef, active } = useDroppable({
        id: getDropzoneId(axisId, FIRST),
    })

    const draggingOver = firstElementId === active?.id ? false : isOver

    return (
        <div
            ref={setNodeRef}
            className={cx(styles.dropZone, {
                [styles.isOver]: draggingOver,
                [styles.isEmpty]: !firstElementId,
            })}
        ></div>
    )
}

DropZone.propTypes = {
    axisId: PropTypes.string,
    firstElementId: PropTypes.string,
}

export { DropZone }
