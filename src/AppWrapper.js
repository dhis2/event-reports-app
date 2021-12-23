import {
    apiFetchOrganisationUnitLevels,
    CurrentUserProvider,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import React, { useState, useEffect, useCallback } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './components/App.js'
import configureStore from './configureStore.js'
import metadataMiddleware from './middleware/metadata.js'
import history from './modules/history.js'
import './locales/index.js'

const AppWrapper = () => {
    const engine = useDataEngine()
    const store = configureStore([
        thunk.withExtraArgument(engine), // FIXME: Not needed for ER? Pointed out by @edoardo
        metadataMiddleware,
    ])

    if (window.Cypress) {
        window.store = store
    }

    const [ouLevels, setOuLevels] = useState(null)

    const doFetchOuLevelsData = useCallback(async () => {
        const ouLevels = await apiFetchOrganisationUnitLevels(engine)

        return ouLevels
    }, [engine])

    useEffect(() => {
        const doFetch = async () => {
            const ouLevelsData = await doFetchOuLevelsData()

            setOuLevels(ouLevelsData)
        }

        doFetch()
    }, [])

    return (
        <ReduxProvider store={store}>
            <CurrentUserProvider>
                {({ userSettings }) =>
                    userSettings?.uiLocale ? (
                        <App
                            initialLocation={history.location}
                            ouLevels={ouLevels} // TODO: Unused by App.js?
                        />
                    ) : null
                }
            </CurrentUserProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
