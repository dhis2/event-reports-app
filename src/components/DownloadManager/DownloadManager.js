import { Analytics } from '@dhis2/analytics'
import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    FlyoutMenu,
    Layer,
    MenuItem,
    MenuSectionHeader,
    Popper,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createRef, useState } from 'react'
import { connect } from 'react-redux'
import { sGetCurrent } from '../../reducers/current'
import { sGetUiLayoutColumns } from '../../reducers/ui'
import { default as MenuButton } from '../Toolbar/MenuBar/MenuButton'

const DOWNLOAD_TYPE_PLAIN = 'plain'
const DOWNLOAD_TYPE_TABLE = 'table'

const FILE_FORMAT_CSV = 'csv'
const FILE_FORMAT_HTML_CSS = 'html+css'
const FILE_FORMAT_JSON = 'json'
const FILE_FORMAT_XLS = 'xls'
const FILE_FORMAT_XML = 'xml'

const ID_SCHEME_UID = 'UID'
const ID_SCHEME_CODE = 'CODE'
const ID_SCHEME_NAME = 'NAME'

export const DownloadManager = ({ current }) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const dataEngine = useDataEngine()
    const { baseUrl } = useConfig()

    const download = (type, format, idScheme) => {
        let req
        let target = '_top'

        switch (type) {
            case DOWNLOAD_TYPE_TABLE:
                req = getTableDownloadRequest(format)
                target = format === FILE_FORMAT_HTML_CSS ? '_blank' : '_top'

                break
            case DOWNLOAD_TYPE_PLAIN:
                req = getPlainDataDownloadRequest(format, idScheme)
                target = [FILE_FORMAT_CSV, FILE_FORMAT_XLS].includes(format)
                    ? '_top'
                    : '_blank'
                break
        }

        // TODO add common parameters
        // if there are for both event/enrollment and PT/LL
        req = req.withParameters({
            completedOnly: current.completedOnly,
        })

        const url = new URL(
            `${baseUrl}/api/${req.buildUrl()}`,
            `${window.location.origin}${window.location.pathname}`
        )

        Object.entries(req.buildQuery()).forEach(([key, value]) =>
            url.searchParams.append(key, value)
        )

        console.log('download url', url, target)
        window.open(url, target)
    }

    const getTableDownloadRequest = format => {
        const analyticsEngine = Analytics.getAnalytics(dataEngine)

        const req = new analyticsEngine.request()
            .fromVisualization(current)
            .withProgram(current.program.id)
            .withStage(current.programStage.id) // XXX might not always be present?
            .withPath('events/query') // TODO depends on event/enrollment
            .withFormat(format)
            .withTableLayout()
            .withColumns(
                current.columns
                    .filter(column => column.dimension !== 'dy')
                    .map(column => column.dimension)
                    .join(';')
            )
            .withRows(
                current.rows
                    .filter(row => row.dimension !== 'dy')
                    .map(row => row.dimension)
                    .join(';')
            )
            .withParameters({
                dataIdScheme: ID_SCHEME_NAME,
                paging: false,
            }) // only for LL

        // not sorted (see old ER)

        //TODO
        //displayPropertyName
        //completedOnly (from options)
        //hideEmptyColumns (from options)
        //hideEmptyRows (from options)
        //showHierarchy (from options)
        //startDate
        //endDate

        return req
    }

    const getPlainDataDownloadRequest = (format, idScheme) => {
        const analyticsEngine = Analytics.getAnalytics(dataEngine)
        const path = 'dataValueSet' // TODO what about the Advanced submenu?

        const req = new analyticsEngine.request()
            .fromVisualization(current, path === 'dataValueSet')
            .withProgram(current.program.id)
            .withStage(current.programStage.id) // XXX might not always be present?
            .withPath('events/query') // TODO depends on event/enrollment
            .withFormat(format)
            .withOutputIdScheme(idScheme)

        // TODO options
        // startDate
        // endDate
        // displayProperty
        // completedOnly
        // hierarchyMeta (from options)
        // outputType
        // programStatus
        // eventStatus
        // limit
        // sortOrder
        // value
        // aggregationType
        // timeField
        // orgUnitField
        // collapsedDataDimensions
        // useOrgUnit (URL)
        // relativePeriodDate

        // TODO LL only
        // need to reflect the page and pageSize and sorting shown in the Visualization component?
        // NO!
        // asc
        // desc
        // pageSize
        // page

        return req
    }

    const toggleDownloadDialog = () => setDialogIsOpen(!dialogIsOpen)

    /* eslint-disable react/jsx-key */
    const plainDataSourceSubLevel = format =>
        React.Children.toArray([
            <MenuSectionHeader label={i18n.t('Metadata ID scheme')} />,
            <MenuItem
                label={i18n.t('ID')}
                onClick={() =>
                    download(DOWNLOAD_TYPE_PLAIN, format, ID_SCHEME_UID)
                }
            />,
            <MenuItem
                label={i18n.t('Code')}
                onClick={() =>
                    download(DOWNLOAD_TYPE_PLAIN, format, ID_SCHEME_CODE)
                }
            />,
            <MenuItem
                label={i18n.t('Name')}
                onClick={() =>
                    download(DOWNLOAD_TYPE_PLAIN, format, ID_SCHEME_NAME)
                }
            />,
        ])
    /* eslint-enable react/jsx-key */

    const buttonRef = createRef()

    return (
        <>
            <div ref={buttonRef}>
                <MenuButton onClick={toggleDownloadDialog} disabled={!current}>
                    {i18n.t('Download')}
                </MenuButton>
            </div>
            {dialogIsOpen && (
                <Layer onClick={() => setDialogIsOpen(false)}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <FlyoutMenu>
                            <MenuSectionHeader label="HTML" />
                            <MenuItem
                                label="HTML+CSS (.html+css)"
                                onClick={() =>
                                    download(
                                        DOWNLOAD_TYPE_TABLE,
                                        FILE_FORMAT_HTML_CSS
                                    )
                                }
                            />
                            <MenuSectionHeader
                                label={i18n.t('Plain data source')}
                            />
                            <MenuItem label="JSON">
                                {plainDataSourceSubLevel(FILE_FORMAT_JSON)}
                            </MenuItem>
                            <MenuItem label="XML">
                                {plainDataSourceSubLevel(FILE_FORMAT_XML)}
                            </MenuItem>
                            <MenuItem label="Microsoft Excel">
                                {plainDataSourceSubLevel(FILE_FORMAT_XLS)}
                            </MenuItem>
                            <MenuItem label="CSV">
                                {plainDataSourceSubLevel(FILE_FORMAT_CSV)}
                            </MenuItem>
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </>
    )
}

DownloadManager.propTypes = {
    current: PropTypes.object,
}

const mapStateToProps = state => ({
    current: sGetCurrent(state),
})

export default connect(mapStateToProps)(DownloadManager)
