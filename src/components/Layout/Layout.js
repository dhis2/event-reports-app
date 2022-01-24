import React from 'react'
import { LAYOUT_TYPE_LINE_LIST } from '../../modules/layout.js'
import LayoutAdjuster from './LayoutAdjuster.js'
import LineListLayout from './LineListLayout/LineListLayout.js'
import classes from './styles/Layout.module.css'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
}

const Layout = () => {
    const layoutType = LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    return (
        <div className={classes.container}>
            <LayoutComponent />
            <LayoutAdjuster />
        </div>
    )
}

export default Layout
