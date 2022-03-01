import { AXIS_ID_FILTERS } from '@dhis2/analytics'
import { Tooltip } from '@dhis2/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { sGetLoadError } from '../../reducers/loader.js'
import { ChipBase } from './ChipBase.js'
import styles from './styles/Chip.module.css'
import { default as TooltipContent } from './TooltipContent.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const Chip = ({
    numberOfConditions,
    dimension,
    axisId,
    items,
    isLast,
    overLastDropZone,
    onClick,
    contextMenu,
    activeIndex,
}) => {
    const { id: dimensionId, name: dimensionName, dimensionType } = dimension

    const {
        attributes,
        listeners,
        index,
        isDragging,
        isSorting,
        over,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: dimensionId,
        data: {
            name: dimensionName,
            dimensionType,
        },
    })
    const globalLoadError = useSelector(sGetLoadError)

    let insertPosition = undefined
    if (over?.id === dimensionId) {
        // This chip is being hovered over by a dragged item
        if (activeIndex === -1) {
            //This item came from the dimensions panel
            insertPosition = AFTER
        } else {
            insertPosition = index > activeIndex ? AFTER : BEFORE
        }
    }

    if (isLast && overLastDropZone) {
        insertPosition = AFTER
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

    const id = Math.random().toString(36)

    const dataTest = `layout-chip-${dimensionId}`

    const renderTooltipContent = () => <TooltipContent dimension={dimension} />

    if (globalLoadError && !dimensionName) {
        return null
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={isLast ? styles.isLast : null}
            style={style}
        >
            <div
                className={cx(styles.chip, {
                    [styles.chipEmpty]:
                        axisId === AXIS_ID_FILTERS &&
                        !items.length &&
                        !numberOfConditions,
                    [styles.active]: isDragging,
                    [styles.insertBefore]: insertPosition === BEFORE,
                    [styles.insertAfter]: insertPosition === AFTER,
                    [styles.showBlank]: !dimensionName,
                })}
            >
                <div className={styles.content}>
                    {
                        <Tooltip
                            content={renderTooltipContent()}
                            placement="bottom"
                        >
                            {({ ref, onMouseOver, onMouseOut }) => (
                                <div
                                    data-test={dataTest}
                                    id={id}
                                    onClick={onClick}
                                    ref={ref}
                                    onMouseOver={onMouseOver}
                                    onMouseOut={onMouseOut}
                                >
                                    <ChipBase
                                        dimensionName={dimensionName}
                                        dimensionType={dimensionType}
                                        numberOfConditions={numberOfConditions}
                                        items={items}
                                    />
                                </div>
                            )}
                        </Tooltip>
                    }
                    {contextMenu}
                </div>
            </div>
        </div>
    )
}

Chip.propTypes = {
    dimension: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    activeIndex: PropTypes.number,
    axisId: PropTypes.string,
    contextMenu: PropTypes.object,
    isLast: PropTypes.bool,
    items: PropTypes.array,
    numberOfConditions: PropTypes.number,
    overLastDropZone: PropTypes.bool,
}

Chip.defaultProps = {
    conditions: [],
    items: [],
}

export default Chip
