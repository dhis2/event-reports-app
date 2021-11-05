import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import { Button, IconReply16, IconThumbUp16, colors } from '@dhis2/ui'
import cx from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { Avatar } from './Avatar'
import classes from './styles/Interpretation.module.css'

const getLikeMutation = id => ({
    resource: `interpretations/${id}/like`,
    type: 'create',
})

const getUnlikeMutation = id => ({
    resource: `interpretations/${id}/like`,
    type: 'delete',
})

export const Interpretation = ({
    interpretation,
    currentUser,
    onClick,
    onLikeToggle,
}) => {
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false)

    const likeInterpretationMutation = useMemo(
        () => getLikeMutation(interpretation.id),
        []
    )

    const unlikeInterpretationMutation = useMemo(
        () => getUnlikeMutation(interpretation.id),
        []
    )

    const onMutationComplete = res => {
        if (res.status === 'OK') {
            onLikeToggle()
        }
    }

    const [likeInterpretation] = useDataMutation(likeInterpretationMutation, {
        onComplete: onMutationComplete,
    })

    const [unlikeInterpretation] = useDataMutation(
        unlikeInterpretationMutation,
        {
            onComplete: onMutationComplete,
        }
    )

    const onLikeClick = isLiked => e => {
        e.stopPropagation()

        isLiked ? unlikeInterpretation() : likeInterpretation()
    }

    useEffect(() => {
        setIsLikedByCurrentUser(
            interpretation.likedBy.some(
                likedBy => likedBy.id === currentUser.id
            )
        )
    }, [currentUser, interpretation])

    return (
        <li
            className={classes.interpretationSection}
            onClick={() => onClick(interpretation.id)}
        >
            <div className={classes.interpretationHeader}>
                <Avatar name={interpretation.user.displayName} />
                {interpretation.user.displayName}
                <time dateTime={interpretation.created}>
                    {moment(interpretation.created).format('DD/MM/YY hh:mm')}
                </time>
            </div>
            <div className={classes.interpretationContent}>
                <RichTextParser>{interpretation.text}</RichTextParser>
            </div>
            <div className={classes.interpretationStats}>
                <span
                    onClick={onLikeClick(isLikedByCurrentUser)}
                    className={cx({ [classes.isLiked]: isLikedByCurrentUser })}
                >
                    {interpretation.likes ? interpretation.likes : null}{' '}
                    <IconThumbUp16
                        color={
                            isLikedByCurrentUser
                                ? colors.teal500
                                : colors.grey700
                        }
                    />
                </span>
                <span onClick={() => onClick(interpretation.id)}>
                    {interpretation.comments.length
                        ? interpretation.comments.length
                        : null}
                    <IconReply16 color={colors.grey700} />
                </span>
            </div>
            <div>
                <Button
                    secondary
                    small
                    onClick={() => onClick(interpretation.id)}
                >
                    {i18n.t('See interpretation')}
                </Button>
            </div>
        </li>
    )
}

Interpretation.defaultProps = {
    onClick: Function.prototype,
    onLikeToggle: Function.prototype,
}

Interpretation.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretation: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onLikeToggle: PropTypes.func,
}
