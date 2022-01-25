import cx from 'classnames'
import React, { useState } from 'react'
import { LAYOUT_TYPE_LINE_LIST } from '../../modules/layout.js'
import LayoutAdjuster from './LayoutAdjuster.js'
import LineListLayout from './LineListLayout/LineListLayout.js'
import classes from './styles/Layout.module.css'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
}

const Layout = () => {
    const [expanded, setExpanded] = useState(false)
    const layoutType = LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    const setLayoutPanelHeight = () => setExpanded(!expanded)

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
            <LayoutAdjuster
                isExpanded={expanded}
                onClick={setLayoutPanelHeight}
            />
        </div>
    )
}

export default Layout
