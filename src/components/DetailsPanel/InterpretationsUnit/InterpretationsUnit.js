import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    IconChevronDown24,
    IconChevronUp24,
    Input,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { Avatar } from './Avatar'
import { InterpretationList } from './InterpretationList'
import classes from './styles/InterpretationsUnit.module.css'

const getInterpretationsQuery = type => ({
    visualization: {
        resource: type,
        id: ({ id }) => id,
        params: {
            fields: 'interpretations[id,user[displayName],created,text,comments[id],likes,likedBy[id]]',
        },
    },
})

export const InterpretationsUnit = ({
    currentUser,
    type,
    id,
    onInterpretationClick,
}) => {
    const [isExpanded, setIsExpanded] = useState(true)

    const interpretationsQuery = useMemo(
        () => getInterpretationsQuery(type),
        []
    )

    const { data, loading, refetch } = useDataQuery(interpretationsQuery, {
        lazy: true,
    })

    useEffect(() => {
        if (id) {
            refetch({ id })
        }
    }, [type, id])

    const onLikeToggle = () => refetch({ id })

    return (
        <div
            className={cx(classes.container, {
                [classes.expanded]: isExpanded,
            })}
        >
            <div
                className={classes.header}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className={classes.title}>
                    {i18n.t('Interpretations')}
                </span>
                {isExpanded ? (
                    <IconChevronUp24 color={colors.grey700} />
                ) : (
                    <IconChevronDown24 color={colors.grey700} />
                )}
            </div>
            {isExpanded && (
                <>
                    {loading && <CircularLoader small />}
                    {data && (
                        <>
                            <InterpretationList
                                currentUser={currentUser}
                                interpretations={
                                    data.visualization.interpretations
                                }
                                onInterpretationClick={onInterpretationClick}
                                onLikeToggle={onLikeToggle}
                            />
                            <div className={classes.input}>
                                <Avatar name={currentUser.name} />
                                <Input
                                    placeholder={i18n.t(
                                        'Write an interpretation'
                                    )}
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

InterpretationsUnit.defaultProps = {
    onInterpretationClick: Function.prototype,
}

InterpretationsUnit.propTypes = {
    currentUser: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onInterpretationClick: PropTypes.func,
}
