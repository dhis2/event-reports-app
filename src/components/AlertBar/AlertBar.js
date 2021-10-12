import { AlertBar as UiAlertBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acClearAlertBar } from '../../actions/alertbar'
import { sGetAlertBar } from '../../reducers/alertbar'
import classes from './styles/AlertBar.module.css'

export const VARIANT_ERROR = 'error'
export const VARIANT_SUCCESS = 'success'
export const VARIANT_WARNING = 'warning'

export const AlertBar = ({ config, onClose }) => {
    const { variant, message, duration } = config

    return (
        message && (
            <div className={classes.container}>
                <UiAlertBar
                    duration={duration}
                    critical={variant === VARIANT_ERROR}
                    success={variant === VARIANT_SUCCESS}
                    warning={variant === VARIANT_WARNING}
                    permanent={
                        variant === VARIANT_ERROR || variant === VARIANT_WARNING
                    }
                    onHidden={onClose}
                >
                    {message}
                </UiAlertBar>
            </div>
        )
    )
}

AlertBar.propTypes = {
    config: PropTypes.object,
    onClose: PropTypes.func,
}

const mapStateToProps = state => ({
    config: sGetAlertBar(state),
})

const mapDispatchToProps = {
    onClose: acClearAlertBar,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertBar)
