import { useDataQuery } from '@dhis2/app-runtime'
import { SYSTEM_SETTINGS } from '../modules/settings'

// TODO create a hook in analytics?

const systemSettingsQuery = {
    systemSettings: {
        resource: 'systemSettings',
        params: {
            key: SYSTEM_SETTINGS,
        },
    },
}

export const useSystemSettings = () => {
    const { data } = useDataQuery(systemSettingsQuery)

    if (data) {
        return data.systemSettings
    }
}
