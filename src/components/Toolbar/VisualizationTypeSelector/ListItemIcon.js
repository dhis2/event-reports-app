import PropTypes from 'prop-types'
import React from 'react'
import {
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_LINE_LIST,
} from '../../../modules/visualization'
import PivotTableIcon from './PivotTableIcon'

const ListItemIcon = ({ iconType, style }) => {
    switch (iconType) {
        case VIS_TYPE_PIVOT_TABLE:
            return <PivotTableIcon style={style} />
        case VIS_TYPE_LINE_LIST:
        default:
            // TODO icon for LineList
            return <PivotTableIcon style={style} />
    }
}

ListItemIcon.propTypes = {
    iconType: PropTypes.string,
    style: PropTypes.object,
}

export default ListItemIcon
