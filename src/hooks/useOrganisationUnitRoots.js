import { apiFetchOrganisationUnitRoots } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'

// TODO create a hook directly in analytics?!

export const useOrganisationUnitRoots = () => {
    const dataEngine = useDataEngine()
    const [orgUnitRoots, setOrgUnitRoots] = useState(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const orgUnitRoots = await apiFetchOrganisationUnitRoots(
                    dataEngine
                )

                setOrgUnitRoots(orgUnitRoots)
            } catch (err) {
                console.log(err)
            }
        }

        if (!orgUnitRoots) {
            fetch()
        }
    }, [orgUnitRoots])

    return orgUnitRoots ? orgUnitRoots[0] : null // TODO why 0, is this because of the current OrgUnitTree only supporting 1 root?
}
