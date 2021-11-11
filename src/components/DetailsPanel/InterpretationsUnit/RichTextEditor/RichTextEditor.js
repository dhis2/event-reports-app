import i18n from '@dhis2/d2-i18n'
import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import {
    Button,
    Popover,
    TextArea,
    Tooltip,
    IconAt24,
    IconFaceAdd24,
    IconLink24,
    IconTextBold24,
    IconTextItalic24,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createRef, useState } from 'react'
import {
    mainClasses,
    toolbarClasses,
    emojisPopoverClasses,
} from './styles/RichTextEditor.style.js'

const smileyFace = ':-)'
const sadFace = ':-('
const thumbsUp = ':+1'
const thumbsDown = ':-1'

const emojisButtonRef = createRef()

const EmojisPopover = ({ onInsertMarkup, onClose }) => (
    <Popover reference={emojisButtonRef} onClickOutside={onClose}>
        <ul className="emojisList">
            <li onClick={() => onInsertMarkup(smileyFace)}>
                <RichTextParser>{smileyFace}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkup(sadFace)}>
                <RichTextParser>{sadFace}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkup(thumbsUp)}>
                <RichTextParser>{thumbsUp}</RichTextParser>
            </li>
            <li onClick={() => onInsertMarkup(thumbsDown)}>
                <RichTextParser>{thumbsDown}</RichTextParser>
            </li>
        </ul>
        <style jsx>{emojisPopoverClasses}</style>
    </Popover>
)

EmojisPopover.propTypes = {
    onClose: PropTypes.func.isRequired,
    onInsertMarkup: PropTypes.func.isRequired,
}

const Toolbar = ({
    onInsertMarkup,
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
                                onClick={() => onInsertMarkup('*bold text*')}
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
                                onClick={() => onInsertMarkup('_italic text_')}
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
                                onClick={() =>
                                    onInsertMarkup('http://<link-url>')
                                }
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
                                onClick={() => onInsertMarkup('@')}
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
                                    onInsertMarkup={markup => {
                                        onInsertMarkup(markup)
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
    onInsertMarkup: PropTypes.func.isRequired,
    onTogglePreview: PropTypes.func.isRequired,
}

export const RichTextEditor = ({ value, inputPlaceholder, onChange }) => {
    const [previewMode, setPreviewMode] = useState(false)

    return (
        <div className="container">
            <Toolbar
                onInsertMarkup={markup => {
                    // TODO handle markdown highlights etc...
                    onChange(value ? value + markup : markup)
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
                <TextArea
                    initialFocus
                    placeholder={inputPlaceholder}
                    value={value}
                    onChange={({ value }) => onChange(value)}
                />
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
