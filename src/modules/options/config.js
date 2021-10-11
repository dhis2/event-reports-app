import { VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import lineListConfig from './lineListConfig'
import pivotTableConfig from './pivotTableConfig'

export const getOptionsByType = type => {
    switch (type) {
        case VIS_TYPE_PIVOT_TABLE:
            return pivotTableConfig()
        default:
            return lineListConfig()
    }
}