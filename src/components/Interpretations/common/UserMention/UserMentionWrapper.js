import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    Menu,
    MenuSectionHeader,
    MenuItem,
    Popper,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { userMentionWrapperClasses } from './styles/UserMentionWrapper.style.js'
import { useUserSearchResults } from './useUserSearchResults'

export const UserMentionWrapper = ({
    children,
    inputReference,
    onUserSelect,
}) => {
    const [element, setElement] = useState(null)
    const [captureText, setCaptureText] = useState(false)
    const [capturedText, setCapturedText] = useState('')
    const [captureStartPosition, setCaptureStartPosition] = useState(null)
    const [selectedUserIndex, setSelectedUserIndex] = useState(0)
    const { users, fetching, clear } = useUserSearchResults({
        searchText: capturedText,
    })

    const reset = () => {
        setCaptureText(false)
        setCapturedText('')
        setCaptureStartPosition(null)
        setSelectedUserIndex(0)

        clear()
    }

    // event bubbles up from the input/textarea
    const onInput = ({ target }) => {
        const { selectionEnd, value } = target

        if (captureText) {
            clear()

            const spacePosition = value.indexOf(' ', captureStartPosition - 1)

            const filterValue = value.substring(
                captureStartPosition,
                spacePosition > 0 ? spacePosition : selectionEnd + 1
            )

            if (!filterValue || filterValue !== capturedText) {
                setCapturedText(filterValue)
            } else if (filterValue.length === 0) {
                setCapturedText('')
                clear()
            }
        }
    }

    // event bubbles up from the wrapped input/textarea
    const onKeyDown = ({ key, target }) => {
        setElement(target)

        const { selectionStart } = target

        if (!captureText && key === '@') {
            setCaptureText(true)
            setCaptureStartPosition(selectionStart + 1)
        } else if (captureText) {
            if (
                key === ' ' ||
                (key === 'Backspace' && selectionStart <= captureStartPosition)
            ) {
                reset()
            } else if (users.length) {
                switch (key) {
                    case 'Enter':
                        event.preventDefault()
                        if (selectedUserIndex >= 0) {
                            onSelect(users[selectedUserIndex])
                        }
                        break
                    case 'ArrowDown':
                        event.preventDefault()

                        if (selectedUserIndex < users.length - 1) {
                            setSelectedUserIndex(selectedUserIndex + 1)
                        }

                        break
                    case 'ArrowUp':
                        event.preventDefault()

                        if (selectedUserIndex > 0) {
                            setSelectedUserIndex(selectedUserIndex - 1)
                        }

                        break
                    default:
                    // other key strokes, typically the text typed
                    // the onInput event handler set on the input element is triggering the user lookup
                }
            }
        }
    }

    const onSelect = user => {
        const originalValue = element.value
        const newValue = `${originalValue.slice(
            0,
            captureStartPosition - 1
        )}${originalValue
            .slice(captureStartPosition - 1)
            .replace(/^@\w*/, `@${user.userCredentials.username} `)}`

        reset()

        // typically for connected components we want the state to be updated too
        // but the logic belongs to the wrapped component, so we just invoke the supplied callback
        if (onUserSelect) {
            onUserSelect(newValue)
        }

        // need to refocus on the input/textarea
        element.focus()

        // position the cursor at the end
        setTimeout(() => element.setSelectionRange(-1, -1), 0)
    }

    const onClick = user => (_, event) => {
        if (event) {
            event.stopPropagation()
            event.preventDefault()
        }

        onSelect(user)
    }

    return (
        <div onKeyDown={onKeyDown} onInput={onInput} className="wrapper">
            {children}
            <div className="clone">
                <span>testetst</span>
            </div>
            {captureText && (
                <Popper reference={inputReference} placement="top-start">
                    <div className="container">
                        <Menu dense>
                            <div className="header">
                                <MenuSectionHeader
                                    dense
                                    hideDivider
                                    label={
                                        capturedText === ''
                                            ? i18n.t('Search for a user')
                                            : i18n.t(
                                                  'Searching for "{{searchText}}"',
                                                  {
                                                      searchText: capturedText,
                                                  }
                                              )
                                    }
                                />
                            </div>
                            {fetching && (
                                <div className="loader">
                                    <CenteredContent>
                                        <CircularLoader small />
                                    </CenteredContent>
                                </div>
                            )}
                            {!fetching &&
                                users.length > 0 &&
                                users.map(u => (
                                    <MenuItem
                                        dense
                                        key={u.id}
                                        onClick={onClick(u)}
                                        label={`${u.displayName} (${u.userCredentials.username})`}
                                        active={
                                            users[selectedUserIndex]?.id ===
                                            u.id
                                        }
                                    />
                                ))}
                            {capturedText &&
                                !fetching &&
                                users.length === 0 && (
                                    <MenuItem
                                        dense
                                        disabled
                                        label={i18n.t('No results found')}
                                    />
                                )}
                        </Menu>
                    </div>
                </Popper>
            )}
            <style jsx>{userMentionWrapperClasses}</style>
        </div>
    )
}

UserMentionWrapper.defaultProps = {
    onUserSelect: Function.prototype,
}

UserMentionWrapper.propTypes = {
    inputReference: PropTypes.object.isRequired,
    onUserSelect: PropTypes.func.isRequired,
    children: PropTypes.node,
}

export default UserMentionWrapper
