import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import DynamicDimensionIcon from '../../assets/DynamicDimensionIcon.js'
import styles from './styles/Chip.module.css'

const ChipOverlay = ({
    numberOfConditions,
    dimensionId,
    dimensionName,
    items,
}) => {
    const id = Math.random().toString(36)

    const renderChipLabelSuffix = () => {
        let itemsLabel = ''
        if (items.length) {
            itemsLabel = i18n.t('{{count}} selected', {
                count: items.length,
            })
        } else if (numberOfConditions) {
            itemsLabel = i18n.t('{{count}} conditions', {
                count: numberOfConditions,
                defaultValue: '{{count}} condition',
                defaultValue_plural: '{{count}} conditions',
            })
        }
        return itemsLabel ? `: ${itemsLabel}` : ''
    }

    const renderChipIcon = () => {
        // TODO: Add the chip icons once they've been spec'ed properly
        return <DynamicDimensionIcon />
    }

    const renderChipContent = () => (
        <>
            <div className={styles.leftIconWrapper}>{renderChipIcon()}</div>
            <span className={styles.label}>{dimensionName}</span>
            <span>{renderChipLabelSuffix()}</span>
        </>
    )

    return (
        <div
            className={cx(styles.chipWrapper, styles.chipWrapperOverlay, {
                [styles.chipEmpty]: !items.length && !numberOfConditions,
            })}
            data-dimensionid={dimensionId}
        >
            <div id={id} className={cx(styles.chip, styles.chipLeft)}>
                {renderChipContent()}
            </div>
        </div>
    )
}

ChipOverlay.propTypes = {
    dimensionId: PropTypes.string.isRequired,
    dimensionName: PropTypes.string.isRequired,
    items: PropTypes.array,
    numberOfConditions: PropTypes.number,
}

ChipOverlay.defaultProps = {
    conditions: [],
    items: [],
}

export default ChipOverlay
