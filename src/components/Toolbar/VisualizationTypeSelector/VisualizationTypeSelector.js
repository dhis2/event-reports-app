import { Card, Popper, Layer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, createRef } from 'react'
import { connect } from 'react-redux'
import ArrowDown from '../../../assets/ArrowDown'
import {
    visTypeDisplayNames,
    VIS_TYPE_PIVOT_TABLE,
} from '../../../modules/visualization'
import { sGetUi, sGetUiType } from '../../../reducers/ui'
import ListItemIcon from './ListItemIcon'
import classes from './styles/VisualizationTypeSelector.module.css'
import VisualizationTypeListItem from './VisualizationTypeListItem'

export const VisualizationTypeSelector = ({ visualizationType }) => {
    const [listIsOpen, setListIsOpen] = useState(false)

    const handleListItemClick = () => () => {
        // TODO add set UI when PT is available
        setListIsOpen(false)
    }

    const getVisTypes = () => Object.keys(visTypeDisplayNames)

    const VisTypesList = (
        <Card dataTest={'visualization-type-selector-card'}>
            <div className={classes.listContainer}>
                <div className={classes.listSection}>
                    {getVisTypes().map(type => (
                        <VisualizationTypeListItem
                            key={type}
                            iconType={type}
                            label={visTypeDisplayNames[type]}
                            description={`TEXT description for ${visTypeDisplayNames[type]}`}
                            isSelected={type === visualizationType}
                            onClick={handleListItemClick(type)}
                            // always disabled until PT is supported
                            disabled={type === VIS_TYPE_PIVOT_TABLE}
                        />
                    ))}
                </div>
            </div>
        </Card>
    )

    const buttonRef = createRef()

    return (
        <div className={classes.container}>
            <div
                onClick={() => setListIsOpen(!listIsOpen)}
                ref={buttonRef}
                className={classes.button}
                data-test={'visualization-type-selector-button'}
            >
                <ListItemIcon iconType={visualizationType} />
                <span data-test="visualization-type-selector-currently-selected-text">
                    {visTypeDisplayNames[visualizationType]}
                </span>
                <span className={classes.arrowIcon}>
                    <ArrowDown />
                </span>
            </div>
            {listIsOpen && (
                <Layer onClick={() => setListIsOpen(false)}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <div className={classes.cardContainer}>
                            {VisTypesList}
                        </div>
                    </Popper>
                </Layer>
            )}
        </div>
    )
}

VisualizationTypeSelector.propTypes = {
    visualizationType: PropTypes.oneOf(Object.keys(visTypeDisplayNames)),
}

const mapStateToProps = state => ({
    visualizationType: sGetUiType(state),
    ui: sGetUi(state),
})

export default connect(mapStateToProps)(VisualizationTypeSelector)
