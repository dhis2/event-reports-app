import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { LAYOUT_TYPE_LINE_LIST } from '../../modules/layout.js'
import LayoutAdjuster from './LayoutAdjuster.js'
import LineListLayout from './LineListLayout/LineListLayout.js'
import classes from './styles/Layout.module.css'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
}

const Layout = ({ isNew }) => {
    const [expanded, setExpanded] = useState(isNew)
    const layoutType = LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    useEffect(() => {
        setExpanded(isNew)
    }, [isNew])

    const toggleExpanded = () => setExpanded(!expanded)

    return (
        <div className={classes.container}>
            <div
                className={cx(
                    classes.overflowContainer,
                    expanded && classes.expanded
                )}
            >
                <LayoutComponent expanded={expanded} />
            </div>
            <LayoutAdjuster isExpanded={expanded} onClick={toggleExpanded} />
        </div>
    )
}

Layout.propTypes = {
    isNew: PropTypes.bool,
}

export default Layout
