import PropTypes from 'prop-types'
import React from 'react'
import ListItemIcon from './ListItemIcon'
import classes from './styles/VisualizationTypeSelector.module.css'

const VisualizationTypeListItem = ({
    iconType,
    label,
    description,
    disabled,
    isSelected,
    onClick,
}) => {
    const classNames = [classes.listItem]

    if (isSelected) {
        classNames.push(classes.listItemActive)
    }

    if (disabled) {
        classNames.push(classes.listItemDisabled)
    }

    return (
        <div className={classNames.join(' ')} onClick={onClick}>
            <div className={classes.listItemIcon}>
                {
                    <ListItemIcon
                        iconType={iconType}
                        style={{ width: 48, height: 48 }}
                    />
                }
            </div>
            <div className={classes.listItemText}>
                <p className={classes.listItemName}>{label}</p>
                <p className={classes.listItemDescription}>{description}</p>
            </div>
        </div>
    )
}

VisualizationTypeListItem.propTypes = {
    description: PropTypes.string,
    disabled: PropTypes.bool,
    iconType: PropTypes.string,
    isSelected: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
}

export default VisualizationTypeListItem
