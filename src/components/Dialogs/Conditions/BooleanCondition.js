import i18n from '@dhis2/d2-i18n'
import { Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/Condition.module.css'

const OPERATOR = 'IN'
const NULL_VALUE = 'NV'
const TRUE_VALUE = '1'
const FALSE_VALUE = '0'

const BooleanCondition = ({ condition, onChange }) => {
    // TODO: param for hiding FALSE for the TRUE_ONLY type... or split this to a separate component?
    const parts = condition.split(':')
    const values = parts[1] || ''

    const onCheckboxChange = (input, checked) => {
        const currentValues = values.length ? values.split(';') : []
        if (checked) {
            setValues([...currentValues, input].join(';'))
        } else {
            setValues(currentValues.filter((v) => v !== input).join(';'))
        }
    }

    const setValues = (input) => {
        onChange(`${OPERATOR}:${input || ''}`)
    }

    return (
        <div className={classes.container}>
            <Checkbox
                checked={values.includes(TRUE_VALUE)}
                label={i18n.t('Yes')}
                onChange={({ checked }) =>
                    onCheckboxChange(TRUE_VALUE, checked)
                }
                dense
                className={classes.checkboxOption}
            />
            <Checkbox
                checked={values.includes(FALSE_VALUE)}
                label={i18n.t('No')}
                onChange={({ checked }) =>
                    onCheckboxChange(FALSE_VALUE, checked)
                }
                dense
                className={classes.checkboxOption}
            />
            <Checkbox
                checked={values.includes(NULL_VALUE)}
                label={i18n.t('Not answered')}
                onChange={({ checked }) =>
                    onCheckboxChange(NULL_VALUE, checked)
                }
                dense
                className={classes.checkboxOption}
            />
        </div>
    )
}

BooleanCondition.propTypes = {
    condition: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default BooleanCondition