import { useDataQuery } from '@dhis2/app-runtime'
import debounce from 'lodash/debounce'
import { useEffect, useRef, useState } from 'react'

const usersQuery = {
    users: {
        resource: 'users',
        params: ({ searchText }) => ({
            fields: 'id,displayName,userCredentials[username]',
            query: searchText,
            order: 'displayName:iasc',
        }),
    },
}

export const useUserSearchResults = ({ searchText }) => {
    const [users, setUsers] = useState([])
    const { data, fetching, refetch } = useDataQuery(usersQuery, {
        lazy: true,
    })

    const debouncedRefetchRef = useRef(debounce(refetch, 250))

    useEffect(() => {
        if (searchText.length) {
            debouncedRefetchRef.current({ searchText })
        }
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
