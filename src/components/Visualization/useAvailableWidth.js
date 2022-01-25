import { useSelector } from 'react-redux'
import {
    sGetUiShowDetailsPanel,
    sGetUiShowAccessoryPanel,
} from '../../reducers/ui.js'

const LEFT_SIDEBARS_WIDTH = 260
const RIGHT_SIDEBAR_WIDTH = 380
const PADDING = 2 * 4
const BORDER = 2 * 1

export const useAvailableWidth = () => {
    const leftOpen = useSelector(sGetUiShowAccessoryPanel)
    const rightOpen = useSelector(sGetUiShowDetailsPanel)

    let availableWidth =
        window.innerWidth - LEFT_SIDEBARS_WIDTH - PADDING - BORDER

    if (leftOpen) {
        availableWidth -= LEFT_SIDEBARS_WIDTH
    }

    if (rightOpen) {
        availableWidth -= RIGHT_SIDEBAR_WIDTH
    }

    return `${availableWidth}px`
}
