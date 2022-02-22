import { useDroppable } from '@dnd-kit/core'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/DropZone.module.css'

const DropZone = ({ position, axisId, firstElementId }) => {
    const { isOver, setNodeRef, active } = useDroppable({
        id: `${axisId}-${position}`,
    })
    const draggingOverFirstPosDropZone =
        firstElementId === active?.id ? false : isOver

    // console.log(
    //     'axisId, firstElementId',
    //     axisId,
    //     firstElementId,
    //     !firstElementId
    // )
    return (
        <div
            ref={setNodeRef}
            className={cx(styles.dropZone, {
                [styles.isOver]: draggingOverFirstPosDropZone,
                [styles.isEmpty]: !firstElementId,
                [styles.first]: position === 'first',
                [styles.last]: position === 'last',
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
