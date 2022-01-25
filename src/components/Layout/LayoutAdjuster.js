import { IconChevronUp16, IconChevronDown16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/LayoutAdjuster.module.css'

const LayoutAdjuster = ({ onClick, isExpanded }) => {
    return (
        <div className={classes.container}>
            <button className={classes.button} onClick={onClick}>
                {isExpanded ? (
                    <IconChevronUp16 color={colors.grey700} />
                ) : (
                    <IconChevronDown16 color={colors.grey700} />
                )}
            </button>
        </div>
    )
}

LayoutAdjuster.propTypes = {
    isExpanded: PropTypes.bool,
    onClick: PropTypes.func,
}

export default LayoutAdjuster
