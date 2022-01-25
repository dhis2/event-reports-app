import cx from 'classnames'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetShowExpandedLayoutPanel } from '../../actions/ui.js'
import { LAYOUT_TYPE_LINE_LIST } from '../../modules/layout.js'
import { sGetUiShowExpandedLayoutPanel } from '../../reducers/ui.js'
import LayoutAdjuster from './LayoutAdjuster.js'
import LineListLayout from './LineListLayout/LineListLayout.js'
import classes from './styles/Layout.module.css'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
}

const Layout = () => {
    const isExpanded = useSelector((state) =>
        sGetUiShowExpandedLayoutPanel(state)
    )
    const dispatch = useDispatch()
    const toggleExpanded = () => {
        return dispatch(acSetShowExpandedLayoutPanel(!isExpanded))
    }

    const layoutType = LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    return (
        <div className={classes.container}>
            <div
                className={cx(
                    classes.overflowContainer,
                    isExpanded && classes.expanded
                )}
            >
                <LayoutComponent />
            </div>
            <LayoutAdjuster isExpanded={isExpanded} onClick={toggleExpanded} />
        </div>
    )
}

export default Layout
