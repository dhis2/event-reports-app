import { Analytics } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { sGetCurrent } from '../../reducers/current'

export const Visualization = ({ visualization }) => {
    const dataEngine = useDataEngine()
    const [fetchResult, setFetchResult] = useState(null)

    // analytics
    const doFetchData = useCallback(async () => {
        const analyticsEngine = Analytics.getAnalytics(dataEngine)

        const req = new analyticsEngine.request()
            .fromVisualization(visualization)
            .withProgram(visualization.program.id)
            .withStage(visualization.programStage.id)
            .withDisplayProperty('NAME')
            .withOutputType(visualization.outputType)
            .withDesc('eventdate')
            // TODO these should come from the Pagination component
            .withPageSize(100)
            .withPage(1)

        const rawResponse = await analyticsEngine.events.getQuery(req)

        return new analyticsEngine.response(rawResponse)
    }, [dataEngine, visualization])

    useEffect(() => {
        setFetchResult(null)

        const doFetchAll = async () => {
            const analyticsResponse = await doFetchData()

            setFetchResult({
                visualization,
                analyticsResponse,
            })
        }

        doFetchAll()
    }, [visualization])

    return !fetchResult ? null : (
        <div>
            {fetchResult?.analyticsResponse && (
                <div>
                    <h6>Metadata</h6>
                    <textarea readOnly rows="10" cols="100">
                        {JSON.stringify(
                            fetchResult.analyticsResponse.metaData,
                            null,
                            2
                        )}
                    </textarea>
                    <h6>Headers</h6>
                    <textarea readOnly rows="10" cols="100">
                        {JSON.stringify(
                            fetchResult.analyticsResponse.headers,
                            null,
                            2
                        )}
                    </textarea>
                    <h6>Rows</h6>
                    <textarea readOnly rows="10" cols="100">
                        {JSON.stringify(
                            fetchResult.analyticsResponse.rows,
                            null,
                            2
                        )}
                    </textarea>
                </div>
            )}
        </div>
    )
}

Visualization.propTypes = {
    visualization: PropTypes.object,
}

const mapStateToProps = state => ({
    visualization: sGetCurrent(state),
})

export default connect(mapStateToProps)(Visualization)
