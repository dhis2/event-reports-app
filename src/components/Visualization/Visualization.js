import { Analytics } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    DataTableToolbar,
    TableHead,
    TableBody,
    Pagination,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import {
    DISPLAY_DENSITY_COMFORTABLE,
    DISPLAY_DENSITY_COMPACT,
} from '../../modules/options'
import styles from './styles/Visualization.module.css'

export const Visualization = ({ visualization, onResponseReceived }) => {
    const dataEngine = useDataEngine()
    const [analyticsResponse, setAnalyticsResponse] = useState(null)
    const [headers, setHeaders] = useState([])
    const [rows, setRows] = useState([])
    const [{ sortField, sortDirection }, setSorting] = useState({
        sortField: 'eventdate', // TODO get field name corresponding to visualization.sortOrder ?!
        sortDirection: 'desc',
    })
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(100)

    const getSortDirection = column =>
        column === sortField ? sortDirection : 'default'

    // analytics
    const fetchAnalyticsData = useCallback(async () => {
        const analyticsEngine = Analytics.getAnalytics(dataEngine)

        const req = new analyticsEngine.request()
            .fromVisualization(visualization)
            .withProgram(visualization.program.id)
            .withStage(visualization.programStage.id)
            .withDisplayProperty('NAME') // TODO from settings ?!
            .withOutputType(visualization.outputType)
            .withParameters({ completedOnly: visualization.completedOnly })
            .withPageSize(pageSize)
            .withPage(page)

        if (sortField) {
            switch (sortDirection) {
                case 'asc':
                    req.withAsc(sortField)
                    break
                case 'desc':
                    req.withDesc(sortField)
                    break
            }
        }

        const rawResponse = await analyticsEngine.events.getQuery(req)

        return new analyticsEngine.response(rawResponse)
    }, [dataEngine, visualization, page, pageSize, sortField, sortDirection])

    useEffect(() => {
        setAnalyticsResponse(null)

        const doFetch = async () => {
            const analyticsResponse = await fetchAnalyticsData()

            setAnalyticsResponse(analyticsResponse)
        }

        doFetch()
    }, [visualization, page, pageSize, sortField, sortDirection])

    useEffect(() => {
        if (analyticsResponse) {
            // extract headers
            const headers = visualization.columns.reduce((headers, column) => {
                headers.push(analyticsResponse.getHeader(column.dimension)) // TODO figure out what to do when no header match the column (ie. pe)
                return headers
            }, [])

            setHeaders(headers)

            // extract rows
            setRows(
                analyticsResponse.rows.reduce((filteredRows, row) => {
                    filteredRows.push(
                        headers.reduce((filteredRow, header) => {
                            if (header) {
                                const rowValue = row[header.index]
                                const itemKey = header.isPrefix
                                    ? `${header.name}_${rowValue}` // TODO underscore or space? check in AnalyticsResponse
                                    : rowValue

                                filteredRow.push(
                                    analyticsResponse.metaData.items[itemKey]
                                        ?.name || rowValue
                                )
                            } else {
                                // FIXME solve the case of visualization.column not mapping to any response.header (ie. "pe")
                                filteredRow.push('-')
                            }
                            return filteredRow
                        }, [])
                    )
                    return filteredRows
                }, [])
            )
            onResponseReceived(analyticsResponse)
        }
    }, [analyticsResponse])

    if (!analyticsResponse) {
        return null
    }

    const large = visualization.displayDensity === DISPLAY_DENSITY_COMFORTABLE
    const small = visualization.displayDensity === DISPLAY_DENSITY_COMPACT

    return (
        <div className={styles.wrapper}>
            <DataTable scrollHeight="500px" scrollWidth="1000px" width="1000px">
                <TableHead>
                    <DataTableRow>
                        {headers.map((header, index) =>
                            header ? (
                                <DataTableColumnHeader
                                    fixed
                                    top="0"
                                    key={header.name}
                                    name={header.name}
                                    onSortIconClick={({ name, direction }) =>
                                        setSorting({
                                            sortField: name,
                                            sortDirection: direction,
                                        })
                                    }
                                    sortDirection={getSortDirection(
                                        header.name
                                    )}
                                    large={large}
                                    small={small}
                                >
                                    {header.column}
                                </DataTableColumnHeader>
                            ) : (
                                <DataTableColumnHeader
                                    fixed
                                    top="0"
                                    key={`undefined_${index}`} // FIXME this is due to pe not being present in headers, needs special handling
                                    large={large}
                                    small={small}
                                />
                            )
                        )}
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <DataTableRow key={index}>
                            {row.map((value, index) => (
                                <DataTableCell
                                    key={index}
                                    large={large}
                                    small={small}
                                >
                                    {value}
                                </DataTableCell>
                            ))}
                        </DataTableRow>
                    ))}
                </TableBody>
            </DataTable>
            <DataTableToolbar position="bottom">
                <div className={styles.paginationControls}>
                    <Pagination
                        page={page}
                        pageCount={analyticsResponse.metaData.pager.pageCount}
                        pageSize={pageSize}
                        total={analyticsResponse.metaData.pager.total}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        pageSizeSelectText={i18n.t('Cases per page')}
                        pageSummaryText={({ firstItem, lastItem, total }) =>
                            i18n.t(
                                '{{firstCaseIndex}}-{{lastCaseIndex}} of {{count}} cases',
                                {
                                    firstCaseIndex: firstItem,
                                    lastCaseIndex: lastItem,
                                    count: total,
                                    // FIXME does it make sense if there is only 1 case?! "1 of 1 case"
                                    // not sure is possible to have empty string for singular with i18n
                                    // TODO also, this string for some reason is not extracted
                                    defaultValue:
                                        '{{firstCaseIndex}} of {{count}} case',
                                    defaultValue_plural:
                                        '{{firstCaseIndex}}-{{lastCaseIndex}} of {{count}} cases',
                                }
                            )
                        }
                    />
                </div>
            </DataTableToolbar>
        </div>
    )
}

Visualization.defaultProps = {
    onResponseReceived: Function.prototype,
}

Visualization.propTypes = {
    visualization: PropTypes.object.isRequired,
    onResponseReceived: PropTypes.func,
}
