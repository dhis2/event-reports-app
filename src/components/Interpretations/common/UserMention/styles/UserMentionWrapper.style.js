import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export const userMentionWrapperClasses = css`
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
