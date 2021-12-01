import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export const userMentionWrapperClasses = css`
    .wrapper {
        position: relative;
    }
    .clone {
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        padding: ${spacers.dp8} ${spacers.dp12};
        border: 1px solid ${colors.grey500};
        font-size: 14px;
        line-height: ${spacers.dp16};
        z-index: 1;
        pointer-events: none;
        opacity: 0.5;
    }
    .container {
        background-color: ${colors.white};
        max-height: 180px;
        overflow: auto;
    }

    .header {
        position: sticky;
        top: 0;
    }

    .loader {
        margin: ${spacers.dp2} 0 ${spacers.dp8} 0;
    }
`
