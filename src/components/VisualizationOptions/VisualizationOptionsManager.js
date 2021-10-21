import { VisualizationOptions } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current'
import { getOptionsByType } from '../../modules/options/config'
import MenuButton from '../MenuButton/MenuButton'
//import UpdateVisualizationContainer from '../UpdateButton/UpdateVisualizationContainer'

const VisualizationOptionsManager = ({ onUpdate }) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const onClick = () => {
        onClose()
        // try {
        //     validateLayout(getCurrentFromUi())
        //     acClearLoadError()
        // } catch (error) {
        //     acSetLoadError(error || new GenericClientError())
        // }
        //onLoadingStart()
        onUpdate()
    }

    const onClose = () => {
        toggleVisualizationOptionsDialog()
    }

    const toggleVisualizationOptionsDialog = () => {
        setDialogIsOpen(!dialogIsOpen)
    }

    const optionsConfig = getOptionsByType()

    return (
        <>
            <MenuButton
                data-test={'app-menubar-options-button'}
                onClick={toggleVisualizationOptionsDialog}
            >
                {i18n.t('Options')}
            </MenuButton>
            {dialogIsOpen && (
                <VisualizationOptions
                    optionsConfig={optionsConfig}
                    onUpdate={onClick}
                    onClose={onClose}
                />
            )}
        </>
    )
}

VisualizationOptionsManager.propTypes = {
    onUpdate: PropTypes.func,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {
    onUpdate: tSetCurrentFromUi,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisualizationOptionsManager)
