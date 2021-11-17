import i18n from '@dhis2/d2-i18n'
import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import {
    Button,
    Popover,
    Tooltip,
    IconAt24,
    IconFaceAdd24,
    IconLink24,
    IconTextBold24,
    IconTextItalic24,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createRef, useEffect, useState } from 'react'
import {
    convertCtrlKey,
    insertMarkdown,
    emojis,
    EMOJI_SMILEY_FACE,
    EMOJI_SAD_FACE,
    EMOJI_THUMBS_UP,
    EMOJI_THUMBS_DOWN,
} from './markdownHandler'
import {
    mainClasses,
    toolbarClasses,
    emojisPopoverClasses,
} from './styles/RichTextEditor.style.js'

const emojisButtonRef = createRef()
const textareaRef = createRef()

const EmojisPopover = ({ onInsertMarkdown, onClose }) => (
    <Popover reference={emojisButtonRef} onClickOutside={onClose}>
        <ul className="emojisList">
            <li onClick={() => onInsertMarkdown(EMOJI_SMILEY_FACE)}>
                <RichTextParser>{emojis[EMOJI_SMILEY_FACE]}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_SAD_FACE)}>
                <RichTextParser>{emojis[EMOJI_SAD_FACE]}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_THUMBS_UP)}>
                <RichTextParser>{emojis[EMOJI_THUMBS_UP]}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_THUMBS_DOWN)}>
                <RichTextParser>{emojis[EMOJI_THUMBS_DOWN]}</RichTextParser>
            </li>
        </ul>
        <style jsx>{emojisPopoverClasses}</style>
    </Popover>
)

EmojisPopover.propTypes = {
    onClose: PropTypes.func.isRequired,
    onInsertMarkdown: PropTypes.func.isRequired,
}

const Toolbar = ({
    onInsertMarkdown,
    onTogglePreview,
    previewButtonDisabled,
    previewMode,
}) => {
    const [emojisPopoverIsOpen, setEmojisPopoverIsOpen] = useState(false)

    return (
        <div className="toolbar">
            {!previewMode ? (
                <div className="actionsWrapper">
                    <div className="mainActions">
                        <Tooltip
                            content={i18n.t('Bold text')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                icon={<IconTextBold24 color={colors.grey700} />}
                                onClick={() => onInsertMarkdown('bold')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Italic text')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                icon={
                                    <IconTextItalic24 color={colors.grey700} />
                                }
                                onClick={() => onInsertMarkdown('italic')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Link to a URL')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                icon={<IconLink24 color={colors.grey700} />}
                                onClick={() => onInsertMarkdown('link')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Mention a user')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <Button
                                secondary
                                small
                                icon={<IconAt24 color={colors.grey700} />}
                                onClick={() => onInsertMarkdown('mention')}
                            />
                        </Tooltip>
                        <Tooltip
                            content={i18n.t('Add emoji')}
                            placement="bottom"
                            closeDelay={200}
                        >
                            <div ref={emojisButtonRef}>
                                <Button
                                    secondary
                                    small
                                    icon={
                                        <IconFaceAdd24 color={colors.grey700} />
                                    }
                                    onClick={() => setEmojisPopoverIsOpen(true)}
                                />
                            </div>
                            {emojisPopoverIsOpen && (
                                <EmojisPopover
                                    onClose={() =>
                                        setEmojisPopoverIsOpen(false)
                                    }
                                    onInsertMarkdown={markup => {
                                        onInsertMarkdown(markup)
                                        setEmojisPopoverIsOpen(false)
                                    }}
                                />
                            )}
                        </Tooltip>
                    </div>

                    <div className="sideActions">
                        <Button
                            secondary
                            small
                            disabled={previewButtonDisabled}
                            onClick={onTogglePreview}
                        >
                            {i18n.t('Preview')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="previewWrapper">
                    <Button secondary small onClick={onTogglePreview}>
                        {i18n.t('Back to write mode')}
                    </Button>
                </div>
            )}
            <style jsx>{toolbarClasses}</style>
        </div>
    )
}

Toolbar.propTypes = {
    previewButtonDisabled: PropTypes.bool.isRequired,
    previewMode: PropTypes.bool.isRequired,
    onInsertMarkdown: PropTypes.func.isRequired,
    onTogglePreview: PropTypes.func.isRequired,
}

export const RichTextEditor = ({ value, inputPlaceholder, onChange }) => {
    const [previewMode, setPreviewMode] = useState(false)

    useEffect(() => textareaRef.current.focus(), [textareaRef.current])

    return (
        <div className="container">
            <Toolbar
                onInsertMarkdown={markdown => {
                    insertMarkdown(
                        markdown,
                        textareaRef.current,
                        (text, caretPos) => {
                            onChange(text)
                            textareaRef.current.focus()
                            textareaRef.current.selectionEnd = caretPos
                        }
                    )
                }}
                onTogglePreview={() => setPreviewMode(!previewMode)}
                previewMode={previewMode}
                previewButtonDisabled={!value}
            />
            {previewMode ? (
                <div className="preview">
                    <RichTextParser>{value}</RichTextParser>
                </div>
            ) : (
                <div onKeyDown={event => convertCtrlKey(event, onChange)}>
                    <textarea
                        className="textarea"
                        ref={textareaRef}
                        placeholder={inputPlaceholder}
                        value={value}
                        onChange={event => onChange(event.target.value)}
                    />
                </div>
            )}
            <style jsx>{mainClasses}</style>
        </div>
    )
}

RichTextEditor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    inputPlaceholder: PropTypes.string,
}
