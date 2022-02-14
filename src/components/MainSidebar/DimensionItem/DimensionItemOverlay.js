import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import {
    IconDimensionData16,
    IconDimensionProgramIndicator16,
    IconFilter16,
    IconDimensionCategoryOptionGroupset16,
    IconDimensionOrgUnitGroupset16,
    IconDimensionOrgUnit16,
    IconCheckmarkCircle16,
    IconUser16,
    IconCalendar16,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_LAST_UPDATED_BY,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
    DIMENSION_TYPE_OU,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_PROGRAM_STATUS,
    DIMENSION_TYPE_CREATED_BY,
} from '../../../modules/dimensionTypes.js'
import styles from './DimensionItem.module.css'

const DIMENSION_TYPE_ICONS = {
    /**PROGRAM**/
    [DIMENSION_TYPE_DATA_ELEMENT]: IconDimensionData16,
    [DIMENSION_TYPE_PROGRAM_ATTRIBUTE]: IconDimensionData16,
    [DIMENSION_TYPE_PROGRAM_INDICATOR]: IconDimensionProgramIndicator16,
    [DIMENSION_TYPE_CATEGORY]: IconFilter16,
    [DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET]:
        IconDimensionCategoryOptionGroupset16,
    /**YOURS**/
    [DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET]:
        IconDimensionOrgUnitGroupset16,
    /**MAIN**/
    [DIMENSION_TYPE_OU]: IconDimensionOrgUnit16,
    [DIMENSION_TYPE_PROGRAM_STATUS]: IconCheckmarkCircle16,
    [DIMENSION_TYPE_EVENT_STATUS]: IconCheckmarkCircle16,
    [DIMENSION_TYPE_CREATED_BY]: IconUser16,
    [DIMENSION_TYPE_LAST_UPDATED_BY]: IconUser16,
    /**TIME**/
    [DIMENSION_ID_PERIOD]: IconCalendar16,
}

const DimensionItemOverlay = ({ dimensionType, name, selected, stageName }) => {
    const Icon = DIMENSION_TYPE_ICONS[dimensionType]

    return (
        <div
            className={cx(styles.dimensionItem, styles.dimensionItemOverlay, {
                [styles.selected]: selected,
            })}
        >
            {Icon && (
                <div className={styles.icon}>
                    <Icon />
                </div>
            )}
            <div className={styles.label}>
                <span className={styles.primary}>{name}</span>
                {stageName && (
                    <span className={styles.secondary}>{stageName}</span>
                )}
            </div>
        </div>
    )
}

DimensionItemOverlay.propTypes = {
    dimensionType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    stageName: PropTypes.string,
}

DimensionItemOverlay.defaultProps = {
    conditions: [],
    items: [],
}

export { DimensionItemOverlay }
