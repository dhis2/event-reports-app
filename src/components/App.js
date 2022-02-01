import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CssVariables } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { connect, useDispatch } from 'react-redux'
import { acClearCurrent, acSetCurrent } from '../actions/current.js'
import { acSetVisualizationLoading } from '../actions/loader.js'
import { acAddMetadata, tSetInitMetadata } from '../actions/metadata.js'
import { tAddSettings } from '../actions/settings.js'
import {
    tClearUi,
    acSetUiFromVisualization,
    acAddParentGraphMap,
    acSetShowExpandedLayoutPanel,
} from '../actions/ui.js'
import { acSetUser } from '../actions/user.js'
import {
    acClearVisualization,
    acSetVisualization,
} from '../actions/visualization.js'
import { EVENT_TYPE } from '../modules/dataStatistics.js'
import history from '../modules/history.js'
import { getParentGraphMapFromVisualization } from '../modules/ui.js'
import { transformVisualization } from '../modules/visualization.js'
import { sGetCurrent } from '../reducers/current.js'
import { sGetIsVisualizationLoading } from '../reducers/loader.js'
import { sGetUiShowDetailsPanel } from '../reducers/ui.js'
import classes from './App.module.css'
import { default as DetailsPanel } from './DetailsPanel/DetailsPanel.js'
import { default as DialogManager } from './Dialogs/DialogManager.js'
import DndContext from './DndContext.js'
import { InterpretationModal } from './InterpretationModal/index.js'
import Layout from './Layout/Layout.js'
import LoadingMask from './LoadingMask/LoadingMask.js'
import { MainSidebar } from './MainSidebar/index.js'
import { default as TitleBar } from './TitleBar/TitleBar.js'
import { Toolbar } from './Toolbar/Toolbar.js'
import StartScreen from './Visualization/StartScreen.js'
import { Visualization } from './Visualization/Visualization.js'

const visualizationQuery = {
    eventVisualization: {
        resource: 'eventVisualizations',
        id: ({ id }) => id,
        // TODO: check if this list is what we need/want (copied from old ER)
        params: {
            fields: [
                '*',
                'columns[dimension,dimensionType,filter,programStage[id],optionSet[id],valueType,legendSet[id],items[dimensionItem~rename(id)]]',
                'rows[dimension,dimensionType,filter,programStage[id],optionSet[id],valueType,legendSet[id],items[dimensionItem~rename(id)]]',
                'filters[dimension,dimensionType,filter,programStage[id],optionSet[id],valueType,legendSet[id],items[dimensionItem~rename(id)]]',
                'program[id,displayName~rename(name),displayEnrollmentDateLabel,displayIncidentDateLabel,displayIncidentDate,programStages[id,displayName~rename(name)]]',
                'programStage[id,displayName~rename(name),displayExecutionDateLabel,displayDueDateLabel,hideDueDate]',
                'access,user[displayName,userCredentials[username]]',
                'href',
                'dataElementDimensions[legendSet[id,name]',
                'dataElement[id,name]]',
                '!interpretations',
                '!userGroupAccesses',
                '!publicAccess',
                '!displayDescription',
                '!rewindRelativePeriods',
                '!userOrganisationUnit',
                '!userOrganisationUnitChildren',
                '!userOrganisationUnitGrandChildren',
                '!externalAccess',
                '!relativePeriods',
                '!columnDimensions',
                '!rowDimensions',
                '!filterDimensions',
                '!organisationUnitGroups',
                '!itemOrganisationUnitGroups',
                '!indicators',
                '!dataElements',
                '!dataElementOperands',
                '!dataElementGroups',
                '!dataSets',
                '!periods',
                '!organisationUnitLevels',
                '!organisationUnits',
            ],
        },
    },
}

const dataStatisticsMutation = {
    resource: 'dataStatistics',
    params: ({ id }) => ({
        favorite: id,
        eventType: EVENT_TYPE,
    }),
    type: 'create',
}

const App = ({
    initialLocation,
    current,
    addMetadata,
    addParentGraphMap,
    addSettings,
    clearCurrent,
    clearVisualization,
    clearUi,
    isLoading,
    setCurrent,
    setInitMetadata,
    setVisualization,
    setVisualizationLoading,
    setUiFromVisualization,
    setUser,
    showDetailsPanel,
    userSettings,
}) => {
    const [previousLocation, setPreviousLocation] = useState(null)
    const [initialLoadIsComplete, setInitialLoadIsComplete] = useState(false)
    const { data, refetch } = useDataQuery(visualizationQuery, {
        lazy: true,
    })
    const [postDataStatistics] = useDataMutation(dataStatisticsMutation)
    const { d2 } = useD2()
    const dispatch = useDispatch()

    const interpretationsUnitRef = useRef()
    const onInterpretationUpdate = () => {
        interpretationsUnitRef.current.refresh()
    }

    const needsRefetch = (location) => {
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

    const parseLocation = (location) => {
        const pathParts = location.pathname.slice(1).split('/')
        const id = pathParts[0]
        const interpretationId = pathParts[2]
        return { id, interpretationId }
    }

    const loadVisualization = (location) => {
        setVisualizationLoading(true)
        const isExisting = location.pathname.length > 1
        if (isExisting) {
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
            //const digitGroupSeparator = sGetSettingsDigitGroupSeparator(getState())
            clearUi()
            setVisualizationLoading(false)
        }

        dispatch(acSetShowExpandedLayoutPanel(!isExisting))
        setInitialLoadIsComplete(true)
        setPreviousLocation(location.pathname)
    }

    const onResponseReceived = (response) => {
        setVisualizationLoading(false)
        const itemsMetadata = Object.entries(response.metaData.items).reduce(
            (obj, [id, item]) => {
                obj[id] = {
                    id,
                    name: item.name || item.displayName,
                    displayName: item.displayName,
                    dimensionItemType: item.dimensionItemType, // TODO needed?
                    code: item.code,
                }

                return obj
            },
            {}
        )

        addMetadata(itemsMetadata)
    }

    useEffect(() => {
        const onMount = async () => {
            await addSettings(userSettings)
            setUser(d2.currentUser)

            setInitMetadata()

            loadVisualization(initialLocation)
        }

        onMount()

        const unlisten = history.listen(({ location }) => {
            const isSaving = location.state?.isSaving
            const isOpening = location.state?.isOpening
            const isResetting = location.state?.isResetting
            const isModalOpening = location.state?.isModalOpening
            const isModalClosing = location.state?.isModalClosing
            const isValidLocationChange =
                previousLocation !== location.pathname &&
                !isModalOpening &&
                !isModalClosing

            // TODO navigation confirm dialog

            if (isSaving || isOpening || isResetting || isValidLocationChange) {
                loadVisualization(location)
            }
        })

        return () => unlisten && unlisten()
    }, [])

    useEffect(() => {
        if (data?.eventVisualization) {
            const { program, programStage } = data.eventVisualization
            const visualization = transformVisualization(
                data.eventVisualization
            )
            const metadata = {
                [program.id]: program,
                [programStage.id]: programStage,
            }

            addParentGraphMap(getParentGraphMapFromVisualization(visualization))
            setVisualization(visualization)
            setCurrent(visualization)
            setUiFromVisualization(visualization, metadata)
            postDataStatistics({ id: visualization.id })
        }
    }, [data])

    return (
        <div
            className={cx(
                classes.eventReportsApp,
                classes.flexCt,
                classes.flexDirCol
            )}
        >
            <Toolbar />
            <div
                className={cx(
                    classes.sectionMain,
                    classes.flexGrow1,
                    classes.flexCt
                )}
            >
                <DndContext>
                    <MainSidebar />
                    <DialogManager />
                    <div
                        className={cx(
                            classes.mainCenter,
                            classes.flexGrow1,
                            classes.flexBasis0,
                            classes.flexCt,
                            classes.flexDirCol
                        )}
                    >
                        <div className={classes.mainCenterLayout}>
                            <Layout />
                        </div>
                        <div className={classes.mainCenterTitlebar}>
                            <TitleBar />
                        </div>
                        <div
                            className={cx(
                                classes.mainCenterCanvas,
                                classes.flexGrow1
                            )}
                        >
                            {initialLoadIsComplete &&
                                (!current && !isLoading ? (
                                    <StartScreen />
                                ) : (
                                    <>
                                        {isLoading && (
                                            <div
                                                className={classes.loadingCover}
                                            >
                                                <LoadingMask />
                                            </div>
                                        )}
                                        {current && (
                                            <Visualization
                                                visualization={current}
                                                onResponseReceived={
                                                    onResponseReceived
                                                }
                                            />
                                        )}
                                        {current && (
                                            <InterpretationModal
                                                onInterpretationUpdate={
                                                    onInterpretationUpdate
                                                }
                                            />
                                        )}
                                    </>
                                ))}
                        </div>
                    </div>
                </DndContext>
                <div
                    className={cx(classes.mainRight, {
                        [classes.hidden]: !showDetailsPanel,
                    })}
                >
                    {showDetailsPanel && current && (
                        <DetailsPanel
                            interpretationsUnitRef={interpretationsUnitRef}
                        />
                    )}
                </div>
            </div>
            <CssVariables colors spacers theme />
        </div>
    )
}

const mapStateToProps = (state) => ({
    current: sGetCurrent(state),
    isLoading: sGetIsVisualizationLoading(state),
    showDetailsPanel: sGetUiShowDetailsPanel(state),
})

const mapDispatchToProps = {
    addMetadata: acAddMetadata,
    addParentGraphMap: acAddParentGraphMap,
    addSettings: tAddSettings,
    clearVisualization: acClearVisualization,
    clearCurrent: acClearCurrent,
    clearUi: tClearUi,
    setCurrent: acSetCurrent,
    setInitMetadata: tSetInitMetadata,
    setVisualization: acSetVisualization,
    setUser: acSetUser,
    setUiFromVisualization: acSetUiFromVisualization,
    setVisualizationLoading: acSetVisualizationLoading,
}

App.propTypes = {
    addMetadata: PropTypes.func,
    addParentGraphMap: PropTypes.func,
    addSettings: PropTypes.func,
    clearCurrent: PropTypes.func,
    clearUi: PropTypes.func,
    clearVisualization: PropTypes.func,
    current: PropTypes.object,
    initialLocation: PropTypes.object,
    isLoading: PropTypes.bool,
    setCurrent: PropTypes.func,
    setInitMetadata: PropTypes.func,
    setUiFromVisualization: PropTypes.func,
    setUser: PropTypes.func,
    setVisualization: PropTypes.func,
    setVisualizationLoading: PropTypes.func,
    showDetailsPanel: PropTypes.bool,
    userSettings: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
