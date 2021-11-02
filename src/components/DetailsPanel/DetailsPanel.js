import { AboutVisualizationUnit } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sGetCurrent } from '../../reducers/current'
import classes from './styles/DetailsPanel.module.css'

export const DetailsPanel = ({ visualization }) => (
    <div className={classes.panel}>
        <AboutVisualizationUnit visualization={visualization} />
    </div>
)

DetailsPanel.propTypes = {
    visualization: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    visualization: sGetCurrent(state),
})

export default connect(mapStateToProps)(DetailsPanel)
