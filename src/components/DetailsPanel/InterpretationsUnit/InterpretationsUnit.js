import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    IconChevronDown24,
    IconChevronUp24,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { Avatar } from './Avatar'
import { InterpretationList } from './InterpretationList'
import { RichTextEditor } from './RichTextEditor'
import classes from './styles/InterpretationsUnit.module.css'

const interpretationsQuery = {
    interpretations: {
        resource: 'interpretations',
        params: ({ type, id }) => ({
            fields: [
                'id',
                'user[displayName]',
                'created',
                'text',
                'comments[id]',
                'likes',
                'likedBy[id]',
            ],
            filter: `${type}.id:eq:${id}`,
        }),
    },
}

export const InterpretationsUnit = ({
    currentUser,
    type,
    id,
    onInterpretationClick,
}) => {
    const [isExpanded, setIsExpanded] = useState(true)

    const { data, loading, refetch } = useDataQuery(interpretationsQuery, {
        lazy: true,
    })

    useEffect(() => {
        if (id) {
            refetch({ type, id })
        }
    }, [type, id])

    const onLikeToggle = () => refetch({ type, id })

    const saveMutationRef = useRef({
        resource: `interpretations/${type}/${id}`,
        type: 'create',
        data: ({ text }) => text,
    })

    const [save] = useDataMutation(saveMutationRef.current, {
        onComplete: res => {
            if (res.status === 'OK') {
                refetch({ type, id })
            }
        },
    })

    const onSave = text => save({ text })

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
                    {loading && (
                        <div className={classes.loader}>
                            <CircularLoader small />
                        </div>
                    )}
                    {data && (
                        <>
                            <InterpretationList
                                currentUser={currentUser}
                                interpretations={
                                    data.interpretations.interpretations
                                }
                                onInterpretationClick={onInterpretationClick}
                                onLikeToggle={onLikeToggle}
                            />
                            <div className={classes.input}>
                                <Avatar name={currentUser.name} />
                                <RichTextEditor
                                    inputPlaceholder={i18n.t(
                                        'Write an interpretation'
                                    )}
                                    saveButtonLabel={i18n.t(
                                        'Save interpretation'
                                    )}
                                    onSave={onSave}
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
