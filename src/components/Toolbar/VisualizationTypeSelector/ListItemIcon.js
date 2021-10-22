import PropTypes from 'prop-types'
import React from 'react'
import PivotTableIcon from '../../../assets/PivotTableIcon'
import {
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_LINE_LIST,
} from '../../../modules/visualization'

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
