import { CachedDataQueryProvider } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './components/App.js'
import configureStore from './configureStore.js'
import metadataMiddleware from './middleware/metadata.js'
import history from './modules/history.js'
import './locales/index.js'

const query = {
    currentUser: {
        resource: 'me',
        params: {
            fields: 'id,username,displayName~rename(name)',
        },
    },
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale', 'keyAnalysisDisplayProperty'],
        },
    },
}

const providerDataTransformation = (rawData) => {
    const { keyAnalysisDisplayProperty, keyUiLocale, ...rest } =
        rawData.userSettings
    return {
        currentUser: rawData.currentUser,
        userSettings: {
            ...rest,
            displayProperty: keyAnalysisDisplayProperty,
            displayNameProperty:
                keyAnalysisDisplayProperty === 'name'
                    ? 'displayName'
                    : 'displayShortName',
            uiLocale: keyUiLocale,
        },
    }
}

const AppWrapper = () => {
    const engine = useDataEngine()
    const store = configureStore([
        thunk.withExtraArgument(engine), // FIXME: Not needed for ER? Pointed out by @edoardo
        metadataMiddleware,
    ])

    if (window.Cypress) {
        window.store = store
    }

    return (
        <ReduxProvider store={store}>
            <CachedDataQueryProvider
                query={query}
                dataTransformation={providerDataTransformation}
            >
                <App initialLocation={history.location} />
            </CachedDataQueryProvider>
        </ReduxProvider>
    )
}

export default AppWrapper
