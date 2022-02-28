import i18n from '@dhis2/d2-i18n'

// parse e.g. 'LT:25:GT:15' to ['LT:25', 'GT:15']
export const parseConditionsStringToArray = (conditionsString) =>
    conditionsString?.match(/[^:]+:[^:]+/g) || conditionsString || []

// parse e.g. ['LT:25', 'GT:15'] to 'LT:25:GT:15'
export const parseConditionsArrayToString = (conditionsArray) =>
    conditionsArray.join(':')

export const NULL_VALUE = 'NV'
export const OPERATOR_EQUAL = 'EQ'
export const OPERATOR_GREATER = 'GT'
export const OPERATOR_GREATER_OR_EQUAL = 'GE'
export const OPERATOR_LESS = 'LT'
export const OPERATOR_LESS_OR_EQUAL = 'LE'
export const OPERATOR_NOT_EQUAL = '!EQ'
export const OPERATOR_EMPTY = `EQ:${NULL_VALUE}`
export const OPERATOR_NOT_EMPTY = `NE:${NULL_VALUE}`
export const OPERATOR_IN = 'IN'
export const OPERATOR_CONTAINS = 'LIKE'
export const OPERATOR_NOT_CONTAINS = '!LIKE'
export const CASE_INSENSITIVE_PREFIX = 'I'
export const NOT_PREFIX = '!'

export const NUMERIC_OPERATORS = {
    [OPERATOR_EQUAL]: i18n.t('equal to (=)'),
    [OPERATOR_GREATER]: i18n.t('greater than (>)'),
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('greater than or equal to (≥)'),
    [OPERATOR_LESS]: i18n.t('less than (<)'),
    [OPERATOR_LESS_OR_EQUAL]: i18n.t('less than or equal to (≤)'),
    [OPERATOR_NOT_EQUAL]: i18n.t('not equal to (≠)'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

export const ALPHA_NUMERIC_OPERATORS = {
    [OPERATOR_EQUAL]: i18n.t('exactly'),
    [OPERATOR_NOT_EQUAL]: i18n.t('is not'),
    [OPERATOR_CONTAINS]: i18n.t('contains'),
    [OPERATOR_NOT_CONTAINS]: i18n.t('does not contain'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

export const DATE_OPERATORS = {
    [OPERATOR_EQUAL]: i18n.t('exactly'),
    [OPERATOR_NOT_EQUAL]: i18n.t('is not'),
    [OPERATOR_GREATER]: i18n.t('after'),
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('after and including'),
    [OPERATOR_LESS]: i18n.t('before'),
    [OPERATOR_LESS_OR_EQUAL]: i18n.t('before or including'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}
