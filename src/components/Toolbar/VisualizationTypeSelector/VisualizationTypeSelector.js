import {
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_LINE_LIST,
    visTypeDisplayNames,
    visTypeDescriptions,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Card, Popper, Layer, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, createRef } from 'react'
import { connect } from 'react-redux'
import ArrowDown from '../../../assets/ArrowDown.js'
import { sGetUi, sGetUiType } from '../../../reducers/ui.js'
import ListItemIcon from './ListItemIcon.js'
import classes from './styles/VisualizationTypeSelector.module.css'
import VisualizationTypeListItem from './VisualizationTypeListItem.js'

const VisualizationTypeSelector = ({ visualizationType }) => {
    const [listIsOpen, setListIsOpen] = useState(false)

    const handleListItemClick = () => () => {
        // TODO add set UI when PT is available
        setListIsOpen(false)
    }

    const renderVisualizationTypeListItem = (type) => {
        return (
            <VisualizationTypeListItem
                key={type}
                visType={type}
                label={visTypeDisplayNames[type]}
                description={visTypeDescriptions[type]}
                isSelected={type === visualizationType}
                onClick={
                    type === VIS_TYPE_PIVOT_TABLE
                        ? null
                        : handleListItemClick(type)
                }
                disabled={type === VIS_TYPE_PIVOT_TABLE}
            />
        )
    }

    const VisTypesList = (
        <Card dataTest={'visualization-type-selector-card'}>
            <div className={classes.listContainer}>
                <div className={classes.listSection}>
                    {[VIS_TYPE_LINE_LIST, VIS_TYPE_PIVOT_TABLE].map((type) =>
                        type === VIS_TYPE_PIVOT_TABLE ? (
                            <Tooltip
                                key={`${type}-tooltip`}
                                placement="bottom"
                                content={i18n.t(
                                    'Pivot tables are not supported by this app yet'
                                )}
                            >
                                {renderVisualizationTypeListItem(type)}
                            </Tooltip>
                        ) : (
                            renderVisualizationTypeListItem(type)
                        )
                    )}
                </div>
            </div>
        </Card>
    )

    const buttonRef = createRef()

    return (
        <div className={classes.container}>
            <div
                onClick={() => setListIsOpen(true)}
                ref={buttonRef}
                className={classes.button}
                data-test={'visualization-type-selector-button'}
            >
                <ListItemIcon visType={visualizationType} />
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

const mapStateToProps = (state) => ({
    visualizationType: sGetUiType(state),
    ui: sGetUi(state),
})

export default connect(mapStateToProps)(VisualizationTypeSelector)
