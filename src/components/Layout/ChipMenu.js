import { Layer, Popper, IconMore16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
    acAddUiLayoutDimensions,
    tRemoveUiLayoutDimensions,
} from '../../actions/ui.js'
import DimensionMenu from '../DimensionMenu/DimensionMenu.js'
import IconButton from '../IconButton/IconButton.js'

const ChipMenu = ({ currentAxisId, dimensionId, visType }) => {
    const dispatch = useDispatch()

    const buttonRef = useRef()
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const toggleMenu = () => setMenuIsOpen(!menuIsOpen)

    const getMenuId = () => `menu-for-${dimensionId}`

    const axisItemHandler = ({ dimensionId, axisId }) => {
        dispatch(acAddUiLayoutDimensions({ [dimensionId]: { axisId } }))
    }

    const removeItemHandler = (id) => dispatch(tRemoveUiLayoutDimensions(id))

    return (
        <>
            <div ref={buttonRef}>
                <IconButton
                    ariaOwns={menuIsOpen ? getMenuId() : null}
                    ariaHaspopup={true}
                    onClick={toggleMenu}
                    dataTest={`layout-chip-menu-button-${dimensionId}`}
                >
                    <IconMore16 />
                </IconButton>
            </div>
            {menuIsOpen && (
                <Layer onClick={toggleMenu}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <DimensionMenu
                            dimensionId={dimensionId}
                            currentAxisId={currentAxisId}
                            visType={visType}
                            axisItemHandler={axisItemHandler}
                            removeItemHandler={removeItemHandler}
                            onClose={toggleMenu}
                            dataTest={'layout-chip-menu-dimension-menu'}
                        />
                    </Popper>
                </Layer>
            )}
        </>
    )
}

ChipMenu.propTypes = {
    axisItemHandler: PropTypes.func,
    currentAxisId: PropTypes.string,
    dimensionId: PropTypes.string,
    removeItemHandler: PropTypes.func,
    visType: PropTypes.string,
}

export default ChipMenu
