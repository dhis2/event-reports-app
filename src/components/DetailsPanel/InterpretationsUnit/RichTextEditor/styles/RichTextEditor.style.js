import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export const mainClasses = css`
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .preview {
        font-size: 14px;
        line-height: 19px;
        color: ${colors.grey900};
    }
`

export const toolbarClasses = css`
    .toolbar {
        background: ${colors.grey050};
        border-radius: 3px;
        border: 1px solid ${colors.grey300};
        margin-bottom: ${spacers.dp4};
    }

    .actionsWrapper {
        display: flex;
        align-items: center;
        padding: ${spacers.dp4};
    }

    .mainActions {
        display: flex;
        gap: ${spacers.dp8};
    }

    .sideActions {
        flex-shrink: 0;
        margin-left: auto;
    }

    .previewWrapper {
        margin-bottom: ${spacers.dp4};
        text-align: right;
    }
`

export const emojisPopoverClasses = css`
    .emojisList {
        display: flex;
        gap: ${spacers.dp8};
        list-style-type: none;
        margin: 0 ${spacers.dp4} 0 ${spacers.dp8};
        padding: 0;
    }

    .emojisList li {
        cursor: pointer;
    }
`
