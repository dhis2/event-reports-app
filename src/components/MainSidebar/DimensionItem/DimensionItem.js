import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import { DimensionItemBase } from './DimensionItemBase.js'

const DimensionItem = ({
    dimensionType,
    id,
    disabled,
    name,
    optionSet,
    selected,
    stageName,
    valueType,
}) => {
    const dispatch = useDispatch()
    const onClick = disabled
        ? undefined
        : () =>
              dispatch(
                  acSetUiOpenDimensionModal(id, {
                      [id]: {
                          id,
                          name,
                          dimensionType,
                          valueType,
                          optionSet,
                      },
                  })
              )

    return (
        <DimensionItemBase
            name={name}
            dimensionType={dimensionType}
            disabled={disabled}
            selected={selected}
            stageName={stageName}
            onClick={onClick}
        />
    )
}

DimensionItem.propTypes = {
    dimensionType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    optionSet: PropTypes.string,
    selected: PropTypes.bool,
    stageName: PropTypes.string,
    valueType: PropTypes.string,
}

export { DimensionItem }
