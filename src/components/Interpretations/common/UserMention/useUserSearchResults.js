import { useDataQuery } from '@dhis2/app-runtime'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'

const usersQuery = {
    users: {
        resource: 'userLookup',
        params: ({ searchText }) => ({
            query: searchText,
        }),
    },
}

export const useUserSearchResults = ({ searchText }) => {
    const [users, setUsers] = useState([])
    const { data, fetching, refetch } = useDataQuery(usersQuery, {
        lazy: true,
    })

    const debouncedRefetch = useMemo(() => debounce(refetch, 250), [refetch])

    useEffect(() => {
        if (searchText.length) {
            debouncedRefetch({ searchText })
        }

        return () => debouncedRefetch.cancel()
    }, [searchText])

    useEffect(() => {
        if (data) {
            setUsers(data.users.users)
        }
    }, [data])

    return {
        users,
        fetching,
        clear: () => setUsers([]),
    }
}
