import { useDataMutation } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CssVariables } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { acClearCurrent, acSetCurrent } from '../actions/current'
import { tSetDimensions } from '../actions/dimensions'
import { acAddMetadata } from '../actions/metadata'
import { acAddSettings } from '../actions/settings'
import { acSetUser } from '../actions/user'
import {
    acClearVisualization,
    acSetVisualization,
} from '../actions/visualization'
import { useOrganisationUnitRoots } from '../hooks/useOrganisationUnitRoots'
import { useSystemSettings } from '../hooks/useSystemSettings'
import { useVisualization } from '../hooks/useVisualization'
import { EVENT_TYPE } from '../modules/dataStatistics'
import history from '../modules/history'
import { sGetCurrent } from '../reducers/current'
import { sGetVisualization } from '../reducers/visualization'
import { default as AlertBar } from './AlertBar/AlertBar'
import classes from './App.module.css'
import DndContext from './DndContext'
import Layout from './Layout/Layout'
import { default as TitleBar } from './TitleBar/TitleBar'
import { Toolbar } from './Toolbar/Toolbar'
import StartScreen from './Visualization/StartScreen'
import { Visualization } from './Visualization/Visualization'

const dataStatisticsMutation = {
    resource: 'dataStatistics',
    params: ({ id }) => ({
        favorite: id,
        eventType: EVENT_TYPE,
    }),
    type: 'create',
}

const App = ({
    location,
    visualization,
    addMetadata,
    addSettings,
    clearCurrent,
    clearVisualization,
    setCurrent,
    setDimensions,
    setVisualization,
    setUser,
    userSettings,
}) => {
    const [previousLocation, setPreviousLocation] = useState(null)
    const [initialLoadIsComplete, setInitialLoadIsComplete] = useState(false)
    const { data, refetch } = useVisualization()
    const [postDataStatistics] = useDataMutation(dataStatisticsMutation)
    const { d2 } = useD2()
    const systemSettings = useSystemSettings()
    const orgUnitRoots = useOrganisationUnitRoots()

    const needsRefetch = location => {
        if (!previousLocation) {
            return true
        }

        const id = location.pathname.slice(1).split('/')[0]
        const prevId = previousLocation.slice(1).split('/')[0]

        if (id !== prevId || previousLocation === location.pathname) {
            return true
        }

        return false
    }

    const parseLocation = location => {
        const pathParts = location.pathname.slice(1).split('/')
        const id = pathParts[0]
        const interpretationId = pathParts[2]
        return { id, interpretationId }
    }

    const loadVisualization = location => {
        if (location.pathname.length > 1) {
            // /currentAnalyticalObject
            // /${id}/
            // /${id}/interpretation/${interpretationId}
            const { id } = parseLocation(location)

            if (needsRefetch(location)) {
                refetch({ id })
            }
        } else {
            clearCurrent()
            clearVisualization()
        }

        setInitialLoadIsComplete(true)
        setPreviousLocation(location.pathname)
    }

    const onResponseReceived = response => {
        const metadata = Object.entries(response.metaData.items).reduce(
            (obj, [id, item]) => {
                obj[id] = {
                    id,
                    name: item.name || item.displayName,
                    displayName: item.displayName,
                    dimensionItemType: item.dimensionItemType, // TODO needed?
                }

                return obj
            },
            {}
        )

        addMetadata(metadata)
    }

    useEffect(() => {
        const prepare = async () => {
            addSettings(userSettings)
            setUser(d2.currentUser)
            await setDimensions()
        }
        prepare()

        loadVisualization(location)

        const unlisten = history.listen(({ location }) => {
            const isSaving = location.state?.isSaving
            const isOpening = location.state?.isOpening
            const isResetting = location.state?.isResetting

            // TODO navigation confirm dialog

            if (
                isSaving ||
                isOpening ||
                isResetting ||
                previousLocation !== location.pathname
            ) {
                loadVisualization(location)
            }
        })

        return () => unlisten && unlisten()
    }, [])

    useEffect(() => {
        if (systemSettings && orgUnitRoots) {
            addSettings({ ...systemSettings, ...orgUnitRoots })
        }
    }, [systemSettings, orgUnitRoots])

    useEffect(() => {
        const visualization = data?.eventReport

        if (visualization) {
            setVisualization(visualization)
            setCurrent(visualization)
            postDataStatistics({ id: visualization.id })
        }
    }, [data])

    return (
        <div className={`${classes.eventReportsApp} flex-ct flex-dir-col`}>
            <Toolbar />
            <div
                className={`${classes.sectionMain} ${classes.flexGrow1} ${classes.flexCt}`}
            >
                <DndContext>
                    <div className={classes.mainLeft}>
                        <span style={{ color: 'red' }}>
                            {'dimension panel'}
                        </span>
                    </div>
                    <div
                        className={`${classes.mainCenter} ${classes.flexGrow1} ${classes.flexBasis0} ${classes.flexCt} ${classes.flexDirCol}`}
                    >
                        <div className={classes.mainCenterLayout}>
                            <Layout />
                        </div>
                        <div className={classes.mainCenterTitlebar}>
                            <TitleBar />
                        </div>
                        <div
                            className={`${classes.mainCenterCanvas} ${classes.flexGrow1}`}
                        >
                            {initialLoadIsComplete ? (
                                visualization ? (
                                    <Visualization
                                        visualization={visualization}
                                        onResponseReceived={onResponseReceived}
                                    />
                                ) : (
                                    <StartScreen />
                                )
                            ) : (
                                <span style={{ color: 'red' }}>
                                    loading... TODO
                                </span>
                                // TODO: add loading spinner
                            )}
                        </div>
                    </div>
                </DndContext>
            </div>
            <AlertBar />
            <CssVariables colors spacers />
        </div>
    )
}

const mapStateToProps = state => ({
    current: sGetCurrent(state),
    visualization: sGetVisualization(state),
})

const mapDispatchToProps = {
    addMetadata: acAddMetadata,
    addSettings: acAddSettings,
    clearVisualization: acClearVisualization,
    clearCurrent: acClearCurrent,
    setCurrent: acSetCurrent,
    setDimensions: tSetDimensions,
    setVisualization: acSetVisualization,
    setUser: acSetUser,
}

App.propTypes = {
    addMetadata: PropTypes.func,
    addSettings: PropTypes.func,
    clearCurrent: PropTypes.func,
    clearVisualization: PropTypes.func,
    location: PropTypes.object,
    setCurrent: PropTypes.func,
    setDimensions: PropTypes.func,
    setUser: PropTypes.func,
    setVisualization: PropTypes.func,
    userSettings: PropTypes.object,
    visualization: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
