import React from 'react'
import classes from '../App.module.css'
import { default as MenuBar } from './MenuBar/MenuBar'

const apiObjectName = 'eventReport' // TODO move to App?

export const Toolbar = () => {
    return (
        <div className={`${classes.sectionToolbar} ${classes.flexCt}`}>
            <div className={classes.toolbarType}>
                <span style={{ color: 'red' }}>{'vis type selector'}</span>
            </div>
            <MenuBar apiObjectName={apiObjectName} dataTest={'app-menubar'} />
        </div>
    )
}
