import i18n from '@dhis2/d2-i18n'
import {
    SingleSelectField,
    SingleSelectOption,
    Button,
    Input,
    MultiSelectField,
    MultiSelectOption,
    MenuDivider,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/Condition.module.css'

const NULL_VALUE = 'NV'
export const OPERATOR_EQUAL = 'EQ'
export const OPERATOR_GREATER = 'GT'
export const OPERATOR_GREATER_OR_EQUAL = 'GE'
export const OPERATOR_LESS = 'LT'
export const OPERATOR_LESS_OR_EQUAL = 'LE'
export const OPERATOR_NOT_EQUAL = '!EQ'
export const OPERATOR_EMPTY = `EQ:${NULL_VALUE}`
export const OPERATOR_NOT_EMPTY = `NE:${NULL_VALUE}`
export const OPERATOR_RANGE_SET = 'IN'

const operators = {
    [OPERATOR_EQUAL]: i18n.t('equal to (=)'),
    [OPERATOR_GREATER]: i18n.t('greater than (>)'),
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('greater than or equal to (≥)'),
    [OPERATOR_LESS]: i18n.t('less than (<)'),
    [OPERATOR_LESS_OR_EQUAL]: i18n.t('less than or equal to (≤)'),
    [OPERATOR_NOT_EQUAL]: i18n.t('not equal to (≠)'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

const l1 = {
    id: 'Yf6UHoPkdS6',
    name: 'Age 10y interval',
    legends: [
        {
            id: 'ZUUGJnvX40X',
            endValue: 40,
            color: '#d9f0a3',
            name: '30 - 40',
            startValue: 30,
        },
        {
            id: 'CpP5yzbgfHo',
            endValue: 50,
            color: '#addd8e',
            name: '40 - 50',
            startValue: 40,
        },
        {
            id: 'cbPqyIAFw9u',
            endValue: 60,
            color: '#78c679',
            name: '50 - 60',
            startValue: 50,
        },
        {
            id: 'Tq4NYCn9eNH',
            endValue: 70,
            color: '#41ab5d',
            name: '60 - 70',
            startValue: 60,
        },
        {
            id: 'scvmgP9F9rn',
            endValue: 100,
            color: '#004529',
            name: '90 - 100',
            startValue: 90,
        },
        {
            id: 'OyVUzWsX8UF',
            endValue: 20,
            color: '#ffffe5',
            name: '10 - 20',
            startValue: 10,
        },
        {
            id: 'b7MCpzqJaR2',
            endValue: 80,
            color: '#238443',
            name: '70 - 80',
            startValue: 70,
        },
        {
            id: 'pZzk1L4Blf1',
            endValue: 10,
            color: '#FFFFFF',
            name: '0 - 10',
            startValue: 0,
        },
        {
            id: 'puI3YpLJ3fC',
            endValue: 90,
            color: '#006837',
            name: '80 - 90',
            startValue: 80,
        },
        {
            id: 'TvM2MQgD7Jd',
            endValue: 30,
            color: '#f7fcb9',
            name: '20 - 30',
            startValue: 20,
        },
    ],
}

const l2 = {
    id: 'TiOkbpGEud4',
    name: 'Age 15y interval',
    legends: [
        {
            id: 'BzQkRWHS7lu',
            endValue: 60,
            color: '#F38026',
            name: '45 - 60',
            startValue: 45,
        },
        {
            id: 'kEf6QhFVMab',
            endValue: 30,
            color: '#E6AE5E',
            name: '15 - 30',
            startValue: 15,
        },
        {
            id: 'aeCp6thd8zL',
            endValue: 105,
            color: '#B3402B',
            name: '90 - 105',
            startValue: 90,
        },
        {
            id: 'FWciVWWrPMr',
            endValue: 90,
            color: '#DC5D3A',
            name: '75 - 90',
            startValue: 75,
        },
        {
            id: 'ETdvuOmTpc6',
            endValue: 45,
            color: '#E4954D',
            name: '30 - 45',
            startValue: 30,
        },
        {
            id: 'xpC4lomA8aD',
            endValue: 75,
            color: '#FF4900',
            name: '60 - 75',
            startValue: 60,
        },
        {
            id: 'rlXteEDaTpt',
            endValue: 15,
            color: '#F7A629',
            name: '0 - 15',
            startValue: 0,
        },
    ],
}

const fetchLegendSets = () => [l1, l2] // TODO: Add fn to fetch all available legendsets for the dimension from the backend

const NumericCondition = ({
    condition,
    onChange,
    onRemove,
    legendSetId,
    numberOfConditions,
    onLegendSetChange,
    useDecimalSteps,
}) => {
    let operator, value

    if (condition.includes(NULL_VALUE)) {
        operator = condition
    } else if (legendSetId && !condition) {
        operator = OPERATOR_RANGE_SET
    } else {
        const parts = condition.split(':')
        operator = parts[0]
        value = parts[1]
    }

    const setOperator = (input) => {
        if (input.includes(NULL_VALUE)) {
            onChange(`${input}`)
        } else if (input.includes(OPERATOR_RANGE_SET)) {
            onChange(`${input}:`)
        } else {
            onChange(`${input}:${value || ''}`)
        }
        if (!input.includes(OPERATOR_RANGE_SET) && legendSetId) {
            onLegendSetChange()
        }
    }

    const availableLegendSets = fetchLegendSets()
    const legendSet =
        availableLegendSets.find((item) => item.id === legendSetId) || {}

    const setValue = (input) => onChange(`${operator}:${input || ''}`)

    return (
        <div className={classes.container}>
            <SingleSelectField
                selected={operator}
                inputWidth="180px"
                placeholder={i18n.t('Choose a condition type')}
                dense
                onChange={({ selected }) => setOperator(selected)}
            >
                {Object.keys(operators).map((key) => (
                    <SingleSelectOption
                        key={key}
                        value={key}
                        label={operators[key]}
                    />
                ))}
                {availableLegendSets && <MenuDivider dense />}
                {availableLegendSets && (
                    <SingleSelectOption
                        key={OPERATOR_RANGE_SET}
                        value={OPERATOR_RANGE_SET}
                        label={i18n.t('is one of preset options')}
                        disabled={numberOfConditions > 1}
                    />
                )}
            </SingleSelectField>
            {operator &&
                !operator.includes(NULL_VALUE) &&
                operator !== OPERATOR_RANGE_SET && (
                    <Input
                        value={value}
                        type="number"
                        onChange={({ value }) => setValue(value)}
                        width="150px"
                        dense
                        step={useDecimalSteps ? '0.1' : '1'}
                    />
                )}
            {operator &&
                operator === OPERATOR_RANGE_SET &&
                availableLegendSets && (
                    <>
                        <SingleSelectField
                            selected={legendSet.id}
                            inputWidth="136px"
                            placeholder={i18n.t('Choose a set of options')}
                            dense
                            onChange={({ selected }) => {
                                onLegendSetChange(selected)
                                setValue(null)
                            }}
                        >
                            {availableLegendSets.map((item) => (
                                <SingleSelectOption
                                    key={item.id}
                                    value={item.id}
                                    label={item.name}
                                />
                            ))}
                        </SingleSelectField>
                        {legendSet.legends && (
                            <MultiSelectField
                                onChange={({ selected }) =>
                                    setValue(selected.join(';'))
                                }
                                inputWidth="330px"
                                selected={
                                    (value?.length && value.split(';')) || []
                                }
                                dense
                            >
                                {legendSet.legends
                                    .sort((a, b) => a.startValue - b.startValue)
                                    .map((legend) => (
                                        <MultiSelectOption
                                            key={legend.id}
                                            value={legend.id}
                                            label={legend.name}
                                        />
                                    ))}
                            </MultiSelectField>
                        )}
                    </>
                )}
            <Button
                type="button"
                small
                secondary
                onClick={onRemove}
                className={classes.removeButton}
            >
                {i18n.t('Remove')}
            </Button>
        </div>
    )
}

NumericCondition.propTypes = {
    condition: PropTypes.string.isRequired,
    numberOfConditions: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onLegendSetChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    legendSetId: PropTypes.string,
    useDecimalSteps: PropTypes.bool,
}

export default NumericCondition